import React from "react";

export const AuthError = React.memo(({ message }) => {
  return (
    <div
      className="bg-white d-flex flex-column text-center align-items-center justify-content-center text-muted"
      style={{ height: "100vh" }}
    >
      <i
        className="feather feather-alert-triangle mb-2 fs-36"
        style={{ color: "var(--danger-rgb-60)" }}
      />
      <div className="fs-18">{message}</div>
    </div>
  );
});

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { error, errorInfo } = this.state;

    if (error) {
      return (
        <section className="px-5 py-3">
          <h1>Unknown error caught!</h1>
          <div className="alert alert-danger" role="alert">
            {error.toString()}
          </div>
          <div className="alert alert-light" role="alert">
            {errorInfo.componentStack.toString()}
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
