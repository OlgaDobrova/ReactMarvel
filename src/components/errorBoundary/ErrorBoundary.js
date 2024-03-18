import { Component } from "react";

import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
  state = {
    error: false,
  };

  //метод используется в предохранителях, только обновляет state
  // static getDerivedStateFromError(error) {
  //   return { error: true };
  // }

  //если что-то нужно прописать в методе
  componentDidCatch(error, errorInfo) {
    this.setState({ error: true });
  }

  render() {
    if (this.state.error) {
      return <ErrorMessage />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
