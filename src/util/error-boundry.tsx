import React, { Component } from 'react'

export class ErrorBoundry extends Component {
  constructor(props: any) {
    super(props)

    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  state = { hasError: false }

  render() {
    return (
      <div>ErrorBoundry</div>
    )
  }
}

export default ErrorBoundry