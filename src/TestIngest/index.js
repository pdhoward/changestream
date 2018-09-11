

///////////////////////////////////////////////////////////
//// ingest content from cms realtime into Discovery  ////
/////////////////////////////////////////////////////////

import React, {Component} from 'react'
import { Header, Button, Checkbox, Form, Icon } from 'semantic-ui-react'

export default class TestIngest extends Component {
  constructor(props) {
    super(props)
      this.state = {
        text: "",
        copy: "",
        result: ""
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
    fetch('api/ingest', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(args)})
      .then((response)=>{return response.json()})
      .then((data)=>{
        console.log(data)
        this.setState({ text: "", result: data.msg })
      })
    }

  render() {
    const {text, result, copy } = this.state

    return (
      <div>
          <Form onSubmit={this.handleSubmit}>
            <Header as='h2' block inverted textAlign='left'>
              <Icon name='comment outline' />
              <Header.Content>
                Ingest Test
              <Header.Subheader>
                ingestng content from cms real-time into Discovery
              </Header.Subheader>
              </Header.Content>
            </Header>
             <Form.Group>
                <Form.Input placeholder='Classifier Name' name='text' value={text} onChange={this.handleChange} />
                <Form.Button content='Ingest' />
              </Form.Group>
            </Form>
          <strong>onChange:</strong>
            <pre>{JSON.stringify({ text }, null, 2)}</pre>
          <strong>onSubmit:</strong>
            <pre>{JSON.stringify({ text: copy, result }, null, 2)}</pre>
    </div>
    )
  }
}
