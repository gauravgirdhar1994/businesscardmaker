import React, { Component } from "react";
import { fabric } from "fabric";
import { ChromePicker, SketchPicker } from "react-color";
import Navbar from "../Navbar";
import { connect } from "react-redux";
import { setCanvas } from "../../Actions/editor";
import "./editor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faDroplet,
  faEnvelope,
  faFont,
  faImage,
  faPaintbrush,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      backgroundColor: "#FFFFFF",
      fontSize: "24",
      href: "",
      color: "#000000",
      canvasScale: 1,
      backgroundImage: "",
      showColorPicker: false,
      fontFamily: "lemon",
      canvasFront: null,
      canvasBack: null,
      currentCanvas: 'canvasFront'
    };
    this.container = React.createRef();
  }
  componentDidMount() {
    const container = this.container.current;
    const { clientHeight, clientWidth } = container;

    const canvasFront = new fabric.Canvas("canvas", {
      backgroundColor: "#FFFFFF",
      height: clientHeight,
      width: clientWidth,
      preserveObjectStacking: true,
    });
    const canvasBack = new fabric.Canvas("canvas", {
      backgroundColor: "#FFFFFF",
      height: clientHeight,
      width: clientWidth,
      preserveObjectStacking: true,
    });

  
    this.setState({
      canvas: canvasFront,
      canvasFront: canvasFront,
      canvasBack: canvasBack,
    });
    this.props.setCanvas({ canvas: this.state.canvas || canvasFront});

    document.addEventListener("keydown", this.onHandleKeyDown);
  }

  onHandleKeyDown = (event) => {
    if (event.which === 46) {
      this.deleteActiveObject();
    }
  };

  addText = () => {
    const { canvas } = this.state;
    canvas.add(
      new fabric.IText("Tap and Type", {
        fontFamily: "lemon",
        fill: this.state.color,
        fontSize: 29,
        padding: 5,
        left: 0,
        right: 0,
      })
    );
  };

  addBackground = (url) => {
    const { canvas } = this.state;
    this.removeBackground();

    fabric.Image.fromURL(
      url,
      (img) => {
        if (canvas) {
          canvas.setBackgroundImage(
            img,
            () => {
              canvas.renderAll();
            },
            {
              scaleX: canvas.width / img.width,
              scaleY: canvas.height / img.height,
            }
          );
        }
      },
      { crossOrigin: "anonymous" }
    );
    this.setState({ backgroundImage: url });
  };

  removeBackground = () => {
    const { canvas } = this.state;
    this.setState({ backgroundImage: "" });
    if (canvas.backgroundImage) {
      canvas.setBackgroundImage(null);
      canvas.renderAll();
    }
    console.log(canvas.getObjects());
  };

  onColorChange = (color) => {
    const { canvas } = this.state;
    this.removeBackground();
    if (canvas) {
      canvas.backgroundColor = color.hex;
      canvas.renderAll();
    }
  };
  textColorChange = (e) => {
    const { canvas } = this.state;
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("fill", e.target.value);
      canvas.renderAll();
    }
    this.setState({ color: e.target.value });
  };

  textBgColorChange = (e) => {
    const { canvas } = this.state;
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("backgroundColor", e.target.value);
      canvas.renderAll();
    }
  };

  onBold = (e) => {
    const { canvas } = this.state;
    if (e.target.checked) {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("fontWeight", "bold");
        canvas.renderAll();
      }
    } else {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("fontWeight", "");
        canvas.renderAll();
      }
    }
  };

  onItalic = (e) => {
    const { canvas } = this.state;
    if (e.target.checked) {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("fontStyle", "italic");
        canvas.renderAll();
      }
    } else {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("fontStyle", "");
        canvas.renderAll();
      }
    }
  };

  onUnderline = (e) => {
    const { canvas } = this.state;
    if (e.target.checked) {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("underline", true);
        canvas.renderAll();
      }
    } else {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("underline", false);
        canvas.renderAll();
      }
    }
  };

  onFontSize = (e) => {
    const { canvas } = this.state;
    console.log("change font size", this.state.fontSize, e.target.value);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("fontSize", e.target.value);
      canvas.renderAll();
    }
    this.setState({ fontSize: e.target.value });
  };
  onFontFamily = (e) => {
    const { canvas } = this.state;
    console.log("change font family", this.state.fontFamily, e.target.value);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("fontFamily", e.target.value);
      canvas.renderAll();
    }
    this.setState({ fontFamily: e.target.value });
  };

  onImageChange = (e) => {
    const { canvas } = this.state;
    var url = URL.createObjectURL(e.target.files[0]);
    fabric.Image.fromURL(
      url,
      (img) => {
        canvas.add(img);
        canvas.renderAll();
      },
      { scaleX: 0.75, scaleY: 0.75 }
    );
    console.log(canvas.getObjects());
  };

  deleteActiveObject = () => {
    const { canvas } = this.state;

    canvas.getActiveObjects().forEach((object) => {
      canvas.remove(object);
    });
  };

  download = (e) => {
    const { canvas } = this.state;
    const image = canvas.toDataURL({
      format: "png",
      quality: 1,
    });
    this.setState({ href: image });
  };

  getBaseOptions(item, type) {
    const { left, top, width, height, scaleX, scaleY } = item;
    let metadata = item.metadata ? item.metadata : {};
    const { fill, angle, originX, originY } = metadata;
    const oldCanvasWidth = item.canvas.width;
    const oldCanvasHeight = item.canvas.height;
    const newCanvasWidth = this.state.canvas.width;
    const newCanvasHeight = this.state.canvas.height;

    let baseOptions = {
      angle: angle ? angle : 0,
      top: top ? (top * newCanvasWidth) / oldCanvasWidth : 0,
      left: left ? (left * newCanvasWidth) / oldCanvasWidth : 0,
      width: type === "img" ? width : (width * newCanvasWidth) / oldCanvasWidth,
      height:
        type === "img" ? height : (height * newCanvasHeight) / oldCanvasHeight,
      originX: originX || "left",
      originY: originY || "top",
      scaleX: (scaleX * newCanvasWidth) / oldCanvasWidth || 1,
      scaleY: (scaleY * newCanvasWidth) / oldCanvasWidth || 1,
      fill: fill || "#000000",
      metadata: metadata,
    };
    return baseOptions;
  }

  setCanvasSize = (percentage) => {
    var canvas = this.state.canvas;

    canvas.setHeight(
      canvas.getHeight() * (percentage / this.state.canvasScale)
    );
    canvas.setWidth(canvas.getWidth() * (percentage / this.state.canvasScale));
    const objects = canvas.getObjects();

    for (var i in objects) {
      const scaleX = objects[i].scaleX;
      const scaleY = objects[i].scaleY;
      const left = objects[i].left;
      const top = objects[i].top;
      const tempScaleX = scaleX * (percentage / this.state.canvasScale);
      const tempScaleY = scaleY * (percentage / this.state.canvasScale);
      const tempLeft = left * (percentage / this.state.canvasScale);
      const tempTop = top * (percentage / this.state.canvasScale);
      objects[i].scaleX = tempScaleX;
      objects[i].scaleY = tempScaleY;
      objects[i].left = tempLeft;
      objects[i].top = tempTop;
      objects[i].setCoords();
    }
    this.addBackground(this.state.backgroundImage);
    this.setState({ canvasScale: percentage });
    canvas.renderAll();
  };

  render() {
    console.log(this.props.editorState);
    let options = [];
    for (let i = 1; i < 17; i++) {
      options.push(
        <option key={i} value={i * 25}>
          {i * 25}%
        </option>
      );
      console.log(this.state.textBox);
    }
    return (
      <div id="Canvas">
        <Navbar>
          <div>
            <div className="iconFont">
              <input
                type="color"
                className="textColor form-control form-control-color"
                value={this.state.color}
                size="10"
                onChange={(e) => this.textColorChange(e)}
              />
            </div>
            <div className="iconFont selectFont">
              <select
                class="form-select"
                onChange={(e) => this.onFontFamily(e)}
                defaultValue={Number(this.state.fontFamily)}
                style={{width: '100px'}}
              >
                {[
                  "Arial",
                  "Lato",
                  "Lemon",
                  "Roboto",
                  "Open Sans",
                  "Montserrat",
                  "Pacifico",
                  "Lobster",
                ].map((el, i) => (
                  <option
                    key={i}
                    value={el}
                    selected={this.state.fontFamily == el}
                    style={{ fontFamily: el }}
                  >
                    {el}
                  </option>
                ))}
              </select>
            </div>
            <div className="iconFont selectFont">
              <select
                class="form-select"
                onChange={(e) => this.onFontSize(e)}
                defaultValue={Number(this.state.fontSize)}
              >
                {[...new Array(101)].map((el, i) => (
                  <option
                    key={i}
                    value={i}
                    selected={Number(this.state.fontSize) == i}
                  >
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div class="cat action">
              <label>
                <input
                  type="checkbox"
                  name="fonttype"
                  onChange={(e) => {
                    this.onBold(e);
                  }}
                />
                <span>B</span>
              </label>
            </div>
            <div class="cat action">
              <label>
                <input
                  type="checkbox"
                  name="fonttype"
                  onChange={(e) => {
                    this.onItalic(e);
                  }}
                />
                <span>I</span>
              </label>
            </div>
            <div class="cat action">
              <label>
                <input
                  type="checkbox"
                  name="fonttype"
                  onChange={(e) => {
                    this.onUnderline(e);
                  }}
                />
                <span>U</span>
              </label>
            </div>
          </div>
          <a
            download={"image.png"}
            className="download"
            href={this.state.href}
            onClick={(e) => this.download(e)}
          >
            Download
          </a>
        </Navbar>
        <div class="sidenav">
          <a href="#" onClick={this.addText}>
            <FontAwesomeIcon icon={faFont} /> Add Text
            <FontAwesomeIcon icon={faPlus} />
          </a>
          <a href="#" className="btn-file">
            <FontAwesomeIcon icon={faImage} /> Add Image
            <FontAwesomeIcon icon={faPlus} />
            <input
              type="file"
              id="img"
              name="img"
              accept="image/*"
              onChange={this.onImageChange}
            />
          </a>
          <a
            href="#"
            onClick={() =>
              this.setState({ showColorPicker: !this.state.showColorPicker })
            }
          >
            <FontAwesomeIcon icon={faDroplet} /> Color
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
        <div className="main">
          <div className="row mb-5">
            <div className="col-md-3 mt-5">
              {this.state.showColorPicker ? (
                <SketchPicker
                  color={this.state.backgroundColor}
                  onChange={this.onColorChange}
                />
              ) : (
                ""
              )}
            </div>
            <div className="col-md-6 mt-5">
              <canvas
                id="canvas"
                style={{
                  width: "100%",
                  height: "100%",
                  margin: "auto",
                  marginTop: "18%",
                  boxShadow:
                    "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
                  display: this.state.currentCanvas === 'canvasFront' ? 'block' : 'none',
                }}
                ref={this.container}
              ></canvas>
              {/* <canvas
                id="canvasBack"
                style={{
                  width: "100%",
                  height: "100%",
                  margin: "auto",
                  marginTop: "10%",
                  boxShadow:
                    "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
                  display: this.state.currentCanvas === 'canvasBack' ? 'block' : 'none',
                }}
                ref={this.container}
              ></canvas> */}
            </div>
            <div className="row mt-5">
              <div className="col-md-3 offset-md-3 mt-5">
                <button
                  className="btn btn-primary mt-5"
                  onClick={() => {
                    this.props.setCanvas({ canvas: this.state.canvasFront });
                    this.setState({ canvas: this.state.canvasFront, currentCanvas : 'canvasFront' });
                  }}
                >
                  <span>Front</span>
                </button>
              </div>
              <div className="col-md-3 mt-5">
                <button
                  className="btn btn-primary mt-5"
                  onClick={() => {
                    this.props.setCanvas({ canvas: this.state.canvasBack });
                    this.setState({ canvas: this.state.canvasBack , currentCanvas : 'canvasBack'});
                  }}
                >
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    editorState: state.editor,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setCanvas: (data) => {
      return dispatch(setCanvas(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
