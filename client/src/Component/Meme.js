import { Col, Container, Figure } from 'react-bootstrap';
import { React } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../App.css';

// the meme is reloaded from the server in the parent component

function Meme(props) {
    const url = "http://localhost:3000/" + props.meme.img;
    
    return (
            <Figure className="relative-container">
                <Figure.Image src={url} />
                <TextBoxes
                    positions = {props.positions}
                    font={props.meme.font}
                    color={props.meme.color}
                    field={props.meme.field} />
            </Figure>
            
    );
}

function TextBoxes(props) {
    let i = 0;
    const mapText = (f) => {
        return (
            <TextBox 
                style={props.positions[f.pos - 1].style}
                text = {f.text}
                key={i++}
                color={props.color}
                font={props.font}
            />
        )
    }
    return props.field.map(mapText)
}

function TextBox(props) {
    return (
        <Container style= {props.style} className = "text-container"  >
            <Col className="d-flex justify-content-center align-items-center" style={{ "minHeight": "100%" }} >
                <Figure.Caption className="text-break text-center fs-1" >
                    <p className="fs-1" style={{ color: props.color, fontFamily: props.font, fontSize: "0.2px" }} >{props.text}</p>
                </Figure.Caption>
            </Col>
        </Container>
    );
}

export default Meme;