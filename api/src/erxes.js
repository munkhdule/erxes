/* globals API_URL */

import { createClass } from 'asteroid';
import {
  collectionItemAdded,
  collectionItemChanged,
} from './actions';
import render from './template';


const Asteroid = createClass();
let asteroid;
let config = {};
let conversationSubId;
let messageSubId;

function subscribeConversations() {
  if (conversationSubId) {
    asteroid.unsubscribe(conversationSubId);
  }

  setTimeout(() => {
    conversationSubId = asteroid.subscribe('api.conversations').id;
  }, 1000);
}

function subscribeMessages(conversationId) {
  if (messageSubId) {
    asteroid.unsubscribe(messageSubId);
  }

  messageSubId = asteroid.subscribe('api.messages', conversationId).id;
}

function connected(dom) {
  if (config.widget === false) { return; }

  subscribeConversations();

  const div = dom.createElement('div');
  div.setAttribute('id', 'erxes-widget');
  dom.body.appendChild(div);
  render(div);
}

function connect({ settings, dom }) {
  config = settings && settings.config || {};

  const modifiedSettings = settings;
  delete modifiedSettings.config;

  const options = {
    endpoint: API_URL,
  };

  asteroid = new Asteroid(options);

  asteroid.ddp.on('connected', () => {
    asteroid.call('api.connect', modifiedSettings)
      .then(() =>
        connected(dom)
      )
      .catch(error => {
        console.error('error', error); // eslint-disable-line no-console
      });
  });

  asteroid.ddp.on('added', ({ collection, id, fields }) => {
    collectionItemAdded({ collection, _id: id, fields });
  });

  asteroid.ddp.on('changed', ({ collection, id, fields, cleared }) => {
    collectionItemChanged({ collection, _id: id, fields, cleared });
  });
}

function call(name, ...params) {
  if (!asteroid) {
    throw Error('Not connected');
  }

  return asteroid.call(`api.${name}`, ...params);
}

global.Erxes = { connect };

export {
  subscribeMessages,
  call,
};

import '../sass/style.scss';