import p5 from "p5";
import React from "react";

type TAttributes = { [key: string]: string };

export interface IP5WrapperProps {
  sketch: (p: p5) => void;
  attributes: TAttributes;
}

export interface IP5WrapperState {
  sketch: (p: p5) => void;
  attributes: TAttributes;
  canvas: p5;
  wrapper?: HTMLElement;
}

class P5Wrapper extends React.Component<IP5WrapperProps, IP5WrapperState> {
  public state: IP5WrapperState;
  public wrapper: HTMLElement = null;

  constructor(props: IP5WrapperProps) {
    super(props);
    this.state = {
      ...props,
      canvas: null,
      // TODO: find a workaround since refs in state are bad practice
      wrapper: this.wrapper
    };
  }

  static getDerivedStateFromProps(
    props: IP5WrapperProps,
    state: IP5WrapperState
  ) {
    if (state.sketch !== props.sketch) {
      const { sketch } = props;
      const canvas = new p5(sketch, state.wrapper);
      state.canvas.remove();
      return { ...state, sketch, canvas };
    }

    // @ts-ignore
    // @TODO: fix type definitions
    if (state.canvas && state.canvas.myCustomRedrawAccordingToNewPropsHandler) {
      // @ts-ignore
      // @TODO: fix type definitions
      state.canvas.myCustomRedrawAccordingToNewPropsHandler(props);
    }

    return state;
  }

  componentDidMount() {
    const canvas = new p5(this.state.sketch, this.wrapper);
    // @ts-ignore
    // @TODO: fix type definitions
    if (canvas.myCustomRedrawAccordingToNewPropsHandler) {
      // @ts-ignore
      // @TODO: fix type definitions
      canvas.myCustomRedrawAccordingToNewPropsHandler(this.props);
    }
    this.setState({ ...this.state, canvas, wrapper: this.wrapper });
  }

  componentWillUnmount() {
    if (this.state.canvas !== null) {
      this.state.canvas.remove();
    }
  }

  render() {
    return (
      <div
        {...this.state.attributes}
        ref={(wrapper) => (this.wrapper = wrapper)}
        data-testid="canvas-wrapper"
      >
        {this.props.children}
      </div>
    );
  }
}

export default P5Wrapper;
