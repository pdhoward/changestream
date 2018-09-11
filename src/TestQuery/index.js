

////////////////////////////////////////////////////////////////////
////  query Discovery content based on text message argument    ///
//////////////////////////////////////////////////////////////////

import React, {Component} from 'react'
import {fetchData} from '../../lib/fetchDiscovery'
import { Header, Button, Checkbox, Form, Icon } from 'semantic-ui-react'

export default class TestQuery extends Component {
  constructor(props) {
    super(props)
      this.state = {
        yourText: "",
        copy: "",
        ask: `Which city are you looking to rent an airbnb `,
        response: "",
        confidence: "",
        intent: "",
        step: 1

      }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e, { yourText, value }) {
    console.log(e)
    this.setState({ ['yourText']: value, copy: value })
  }

  handleSubmit() {
    let args = {}
    args.text= this.state.yourText
    console.log(this.state)
    console.log(args.text)
        fetch('api/intent', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(args)
          })
          .then((response)=>{return response.json()
          })
          .then((data)=>{
            console.log('Response: ', data)
            let obj = data[0]
            this.setState({ intent: obj.label, confidence: obj.value, yourText: "" })
          })

        fetchData(this.state.text, null, (data) => {
          this.advanceDialogue(data)
          })
    }

    advanceDialogue(data){
      if (this.state.step==1){
        this.setState({step: 2, ask: `This is what i have so far. I found ${data.numMatches}. ${data.numPositive} are positive.
          I displayed the first review below. What else can I help you find?`, response: data.results[1].text.substring(0, 25) })
        return
      }
      if (this.state.step==2){
        this.setState({step: 3, ask: `Ok. This is fun. I found ${data.numMatches}. ${data.numNegative} are negative.
          Here is a sample. Now what?`, response: data.results[1].text.substring(0, 25) })
        return
      }
      if (this.state.step==3){
        this.setState({step: 1, ask: `So this is what it looks like to query Discovery. More work is needed to understand all Discovery options.
          Here is top result from ${data.numMatches} records retrieved. Enter a new query`, response: data.results[1].text.substring(0, 25) })
        return
      }

    }


    showStep() {
      const {yourText, ask, confidence, intent, response, copy } = this.state
      switch (this.state.step) {
        case 1:
        //  this.setState({ step: 2, ask: `Which city are you traveling to?` })
          return <pre>{JSON.stringify({ ask, yourText: copy, confidence, intent, response }, null, 2)}</pre>
          break;
        case 2:
        //  this.setState({ step: 3, ask: `Which city are you traveling to?` })
          return <pre>{JSON.stringify({ ask, yourText: copy, confidence, intent, response }, null, 2)}</pre>
          break;
        case 3:
          return <pre>{JSON.stringify({ ask, yourText: copy, confidence, intent, response }, null, 2)}</pre>
          break;
        case 4:
          return <pre>{JSON.stringify({ ask, yourText: copy, confidence, intent, response }, null, 2)}</pre>
          break;
        default:
          return <pre>{JSON.stringify({ ask, yourText: copy, confidence, intent, response }, null, 2)}</pre>

      }
    }

  render() {
    const {yourText, intent, confidence } = this.state
    let style = {
      width: (this.state.step / 4 * 100) + '%'
    }

    return (
      <div>
          <Form onSubmit={this.handleSubmit}>
            <Header as='h2' block inverted textAlign='left'>
              <Icon name='comment outline' />
              <Header.Content>
                Query Test
              <Header.Subheader>
                query content through a dialogue
              </Header.Subheader>
              </Header.Content>
            </Header>
             <Form.Group>
                <Form.Input placeholder='query' name='yourText' value={yourText} onChange={this.handleChange} />
                <Form.Button content='Submit' />
              </Form.Group>
            </Form>
          <strong>onChange:</strong>
            <pre>{JSON.stringify({ yourText }, null, 2)}</pre>
          <strong>onSubmit:</strong>
            <br></br>
          <progress className="ui active progress" >
              <div className = "bar">
                  <div className="progress" style={style}></div>
              </div>
          </progress>
            {this.showStep()}
    </div>
    )
  }
}
