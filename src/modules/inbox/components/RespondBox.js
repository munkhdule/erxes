import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Tip, FormControl } from 'modules/common/components';
import { Alert, uploadHandler } from 'modules/common/utils';
import { ResponseTemplate } from '../containers';
import Editor from './Editor';
import {
  RespondBoxStyled,
  EditorActions,
  Attachment,
  AttachmentPreview,
  AttachmentIndicator,
  PreviewImg,
  FileName
} from '../styles';

const propTypes = {
  conversation: PropTypes.object.isRequired,
  sendMessage: PropTypes.func.isRequired,
  setAttachmentPreview: PropTypes.func.isRequired,
  teamMembers: PropTypes.object
};

class RespondBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorKey: 'editor',
      isInternal: false,
      attachments: [],
      responseTemplate: '',
      content: '',
      mentionedUserIds: []
    };

    // on editor content change
    this.onEditorContentChange = this.onEditorContentChange.bind(this);

    // on new members mention
    this.onAddMention = this.onAddMention.bind(this);

    // on shift + enter press in editor
    this.onShifEnter = this.onShifEnter.bind(this);

    this.onSend = this.onSend.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.handleFileInput = this.handleFileInput.bind(this);
    this.onSelectTemplate = this.onSelectTemplate.bind(this);
  }

  // save editor current content to state
  onEditorContentChange(content) {
    this.setState({ content });
  }

  // save mentioned user to state
  onAddMention(mentionedUserIds) {
    this.setState({ mentionedUserIds });
  }

  onSend(e) {
    e.preventDefault();

    this.addMessage();

    // redrawing editor after sned button, so editor content will be reseted
    this.setState({ editorKey: `${this.state.editorKey}Key` });
  }

  onSelectTemplate(responseTemplate) {
    this.setState({
      responseTemplate: responseTemplate.content,

      // set attachment from response template files
      attachments: responseTemplate.files || []
    });
  }

  // on shift + enter press in editor
  onShifEnter() {
    this.addMessage();
  }

  handleFileInput(e) {
    e.preventDefault();

    const file = e.target.files[0];

    uploadHandler({
      file,

      beforeUpload: () => {},

      afterUpload: ({ response, fileInfo }) => {
        // set attachments
        this.setState({
          attachments: [
            ...this.state.attachments,
            Object.assign({ url: response }, fileInfo)
          ]
        });
        // remove preview
        this.props.setAttachmentPreview(null);
      },

      afterRead: ({ result, fileInfo }) => {
        this.props.setAttachmentPreview(
          Object.assign({ data: result }, fileInfo)
        );
      }
    });
  }

  addMessage() {
    const { conversation, sendMessage } = this.props;
    const { isInternal, attachments, content, mentionedUserIds } = this.state;

    const message = {
      conversationId: conversation._id,
      content: content || ' ',
      internal: isInternal,
      attachments,
      mentionedUserIds
    };

    sendMessage(message, error => {
      if (error) {
        return Alert.error(error.message);
      }

      // clear attachments
      return this.setState({ attachments: [] });
    });

    this.setState({
      // clear mentioned user ids
      mentionedUserIds: []
    });
  }

  toggleForm() {
    this.setState({
      isInternal: !this.state.isInternal
    });
  }

  renderIncicator() {
    const attachments = this.state.attachments;
    if (attachments.length > 0) {
      return (
        <AttachmentIndicator>
          {attachments.map(attachment => (
            <Attachment key={attachment.name}>
              <AttachmentPreview>
                {attachment.type.startsWith('image') && (
                  <PreviewImg
                    style={{ backgroundImage: `url('${attachment.url}')` }}
                  />
                )}
              </AttachmentPreview>
              <FileName>{attachment.name}</FileName>
              <div>({Math.round(attachment.size / 1000)}kB)</div>
            </Attachment>
          ))}
        </AttachmentIndicator>
      );
    }

    return null;
  }

  render() {
    const { isInternal, responseTemplate } = this.state;
    const integration = this.props.conversation.integration || {};

    const Buttons = (
      <EditorActions>
        <FormControl
          className="toggle-message"
          componentClass="checkbox"
          onChange={this.toggleForm}
        >
          Internal note
        </FormControl>
        <Tip text="Attach file">
          <label>
            <Icon icon="android-attach" size={17} />
            <input type="file" onChange={this.handleFileInput} />
          </label>
        </Tip>

        <ResponseTemplate
          brandId={integration.brandId}
          attachments={this.state.attachments}
          content={this.state.content}
          onSelect={this.onSelectTemplate}
        />

        <Button onClick={this.onSend} btnStyle="success" size="small">
          <Icon icon="android-send" /> Send
        </Button>
      </EditorActions>
    );

    let type = 'message';

    if (isInternal) {
      type = 'note';
    }

    let placeholder = `To send your ${
      type
    } press [Enter] and [Shift + Enter] to add a new line …`;

    return (
      <RespondBoxStyled isInternal={isInternal}>
        <Editor
          key={this.state.editorKey}
          onChange={this.onEditorContentChange}
          onAddMention={this.onAddMention}
          onShifEnter={this.onShifEnter}
          placeholder={placeholder}
          mentions={this.props.teamMembers}
          showMentions={isInternal}
          responseTemplate={responseTemplate}
        />

        {this.renderIncicator()}
        {Buttons}
      </RespondBoxStyled>
    );
  }
}

RespondBox.propTypes = propTypes;

export default RespondBox;
