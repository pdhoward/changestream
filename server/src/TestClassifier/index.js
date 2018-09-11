

/////////////////////////////////////////////////////////
////  build a classifier real time from cms content  ///
///////////////////////////////////////////////////////

import React, {Component} from 'react'
import { Header, Button, Checkbox, Form, Icon } from 'semantic-ui-react'

export default class TestClassifier extends Component {
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
    fetch('api/classify', {
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
                Classifier Test
              <Header.Subheader>
                classifier built real time using content from cms
              </Header.Subheader>
              </Header.Content>
            </Header>
             <Form.Group>
                <Form.Input placeholder='Classifier Name' name='text' value={text} onChange={this.handleChange} />
                <Form.Button content='Submit' />
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
