/* @flow */

import React from 'react'

var Test = React.createClass({

  displayName: 'Test',

  render(): ReactElement {
    return <div>wooooo</div>
  }

})

var el = document.getElementById('game')
React.render(<Test/>, el)
