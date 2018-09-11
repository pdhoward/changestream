
//////////////////////////////////////////////////////////////////
////  classify intent of a text message using NLP classifier  ///
////////////////////////////////////////////////////////////////

import React, {Component} from 'react'
import { Header, Button, Checkbox, Form, Icon } from 'semantic-ui-react'

export default class TestIntent extends Component {
  constructor(props) {
    super(props)
      this.state = {
        text: "",
        copy: "",
        intent: "",
        score: ""
      }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e, { text, value }) {
    console.log(e)
    this.setState({ ['text']: value, copy: value })
  }

  handleSubmit() {
    let args = {}
    args.text= this.state.text
    console.log(this.state)
    console.log(args.text)
    fetch('api/intent', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(args)})
      .then((response)=>{return response.json()})
      .then((data)=>{
        console.log('Response: ', data)
        let obj = data[0]
        this.setState({ intent: obj.label, score: obj.value, text: "" })
      })
    }

  render() {
    const {text, intent, score, copy } = this.state

    return (
      <div>
          <Form onSubmit={this.handleSubmit}>
            <Header as='h2' block inverted textAlign='left'>
              <Icon name='comment outline' />
              <Header.Content>
                Intent Test
              <Header.Subheader>
                intent retrieved for a given text message
              </Header.Subheader>
              </Header.Content>
            </Header>
             <Form.Group>
                <Form.Input placeholder='Text Message' name='text' value={text} onChange={this.handleChange} />
                <Form.Field>
                  <Checkbox label='I agree that Strategic Machines is very cool ' />
                </Form.Field>
                <Form.Button content='Submit' />
              </Form.Group>
            </Form>
          <strong>onChange:</strong>
            <pre>{JSON.stringify({ text }, null, 2)}</pre>
          <strong>onSubmit:</strong>
            <pre>{JSON.stringify({ text: copy, intent, score }, null, 2)}</pre>
    </div>
    )
  }
}
