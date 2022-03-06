import { Col, Row, Container, Form, Button, Figure } from 'react-bootstrap';
import { React, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../App.css';
import API from '../API';

const URL = "http://localhost:3000/";


// TODO eventualmente modificare il form editor
function Editor(props) {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState("");
    const [visible, setVisible] = useState(false);
    const [text1, setText1] = useState('1');
    const [text2, setText2] = useState('2');
    const [text3, setText3] = useState('3');
    const [color, setColor] = useState('#000000');
    const [font, setFont] = useState('Aclonica');
    const [positions, setPositions] = useState({});   // all positions retrieved from the server
    const [submitted, setSubmitted] = useState(false);
    const [errorMessageTitle, setErrorMessageTitle] = useState('');
    const [errorMessageText, setErrorMessageText] = useState('');
    const [lockedVisibility, setLockedVisibility] = useState(false);
    const [goBack, setGoBack] = useState(false);
    //const [error, setError] = useState(false);
    const [url, setUrl] = useState("");
    const text = [text1, text2, text3];
    const [pos, setPos] = useState([]); // style position to render the component
    // introduced to resolve missing dependency in the useEffect at mount time
    const {imageId, memeId, setMemes, user, setDirty, setLoading, handleErrors} = props; 
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const firstMount = async () => {
            setMounted(true);
            setLoading(true);
        }

        const fetchData = async () => {
            try {
                const positionsToLoad = await API.getPositions();
                setPositions(positionsToLoad);
                if (memeId !== undefined) {
                    // in this case copy
                    const memeToCopy = await API.getMeme(memeId);
                    if (memeToCopy.author.id !== user.id && !memeToCopy.visible) {
                        setLockedVisibility(true);
                    }
                    setImage(memeToCopy.img);
                    setUrl(URL + "/" + memeToCopy.img);
                    setFont(memeToCopy.font);
                    setVisible(memeToCopy.visible);
                    setColor(memeToCopy.color);
                    setTitle(memeToCopy.title);
                    let pos = [];
                    let i = 0;
                    for (let f of memeToCopy.field) {
                        pos.push(f.pos);
                        switch (i++) {
                            case 0:
                                setText1(f.text)
                                break;
                            case 1:
                                setText2(f.text)
                                break;
                            case 2:
                                setText3(f.text)
                                break;
                            default:
                                break;
                        }
                    }
                    setPos(pos);
                } else {
                    // in this case edit a new meme
                    const image = await API.getImage(imageId);
                    setPos([...image.field.map(p => p.pos)]);
                    setImage(image.img);
                    setUrl(URL + "/" + image.img);
                }
            } catch (error) {
                // in case of error alert show the error and redirect to the home page
                handleErrors(error);
                setSubmitted(true);
                //console.log(error.error);
            }
            
        }
        /** 
         * Mounted introduced to resolve missing dependency 
         * and infinite reloadings due to chances in dependency
         * is set to true at the beginning of the function
         * The function fisrt mount is intoduced to avoid multiple requests
         * in the meanwhile that mounted become true, in this way first mount
         * is set to false ( and loading to true) and the start the fetch phase
         */
        !mounted && firstMount().then( ()=> fetchData()).then( () => setLoading(false)); // otherwise the error message of failed fetch is displayed    
    }, [imageId, memeId, user, setLoading, handleErrors, mounted]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        let valid = true;
        setErrorMessageText("");
        setErrorMessageTitle("");


        if (title === "") {
            valid = false;
            setErrorMessageTitle((e) => {
                return "Invalid title (you should define a title for the meme)"
            })
        } else {
            if ((text1 === '' || text1 === '1') && (text2 === '' || text2 === '2') && (text3 === '' || text3 === '3')) {
                valid = false;
                setErrorMessageText((e) => {
                    return ("Textbox empty (you should fill at least one textbox )")
                }
                )
            }
        }

        if (valid) {
            // field has pos:,text:
            let fieldToAdd = [];
            for (let i = 0; i < pos.length; i++)
                fieldToAdd.push({ pos: pos[i], text: text[i] })

            const meme = {
                id: 0,    // just to avoid warning on duplicate key on temporary memes list
                img: image,
                title: title,
                author: { id: user.id, name: user.name },
                font: font,
                color: color,
                visible: visible,
                field: fieldToAdd
            };

            setMemes((oldMemes) => [...oldMemes, meme]);
            setSubmitted(true);
            if (memeId !== undefined)
                API.copyMeme(meme, memeId)
            else
                API.addMeme(meme);
            setDirty(true);
            // API call to insert the image in the database
        }
    };

    return <> { submitted && <Redirect to="/" strict />}
        {goBack && memeId !== undefined ? <Redirect to="/" strict /> : goBack && <Redirect to="/images" strict />}

        <Container fluid >
            <Row >
                <Col className="pt-3 d-flex justify-content-center" sm={8}>
                    <Figure className="relative-container">
                        <Figure.Image src={url} />
                        <TextBoxes
                            positions={positions}
                            text={text}
                            color={color}
                            font={font}
                            field={pos} />
                    </Figure>
                </Col>
                <Col className="bg-light pt-3 d-none d-sm-block relative-container" sm={4} >   
                    < Form >
                        <Form.Label> Title </Form.Label>
                        <Form.Control
                            placeholder="Title"
                            value={title === '' ? "" : title}
                            onChange={(ev) => (setTitle(ev.target.value))}
                            isInvalid={errorMessageTitle} />
                        <Form.Control.Feedback type="invalid">
                            {errorMessageTitle}
                        </Form.Control.Feedback>
                        <Form.Group  >
                            <Form.Label >Color </Form.Label>
                            <Form.Control
                                type="color"
                                id="ColorInput"
                                defaultValue={color}
                                title="Choose your color"
                                onChange={(ev) => (setColor(ev.target.value))}
                            />
                            <Form.Label> Font </Form.Label>

                            <Form.Control
                                as="select"
                                onChange={(ev) => (setFont(ev.target.value))}
                                className="me-sm-1"
                                value={font} 
                            >
                                <option value="Aclonica">Aclonica</option>
                                <option value="Bangers">Bangers</option>
                                <option value="Barriecito">Barriecito</option>
                                <option value="Encode Sans SC">Encode Sans SC</option>
                                <option value="La Belle Aurore">La Belle Aurore</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Label>TextBox1</Form.Label>
                        <Form.Control
                            placeholder="Text 1"
                            value={text1 === '' || text1 === '1' ? "" : text1}
                            as="textarea"
                            onChange={(ev) => (setText1(ev.target.value))}
                            isInvalid={errorMessageText} />
                        <Form.Control.Feedback type="invalid">
                            {errorMessageText}
                        </Form.Control.Feedback>
                        {pos.length < 2 ? <></> : <Form.Group>
                            <Form.Label>TextBox2</Form.Label>
                            <Form.Control
                                placeholder="Text 2"
                                value={text2 === '' || text2 === '2' ? "" : text2}
                                as="textarea"
                                onChange={(ev) => (setText2(ev.target.value))}
                                isInvalid={errorMessageText}>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errorMessageText}
                            </Form.Control.Feedback>
                        </Form.Group>}
                        {pos.length < 3 ? <></> : <Form.Group>
                            <Form.Label>TextBox3</Form.Label>
                            <Form.Control
                                placeholder="Text 3"
                                value={text3 === '' || text3 === '3' ? "" : text3}
                                as="textarea"
                                onChange={(ev) => (setText3(ev.target.value))}
                                isInvalid={errorMessageText}>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errorMessageText}
                            </Form.Control.Feedback>
                        </Form.Group>}
                        <Form.Check
                            type="checkbox"
                            id={0}
                            checked={visible}
                            disabled={lockedVisibility}
                            label="public"
                            onChange={() => setVisible((oldVis) => !oldVis)}
                        />
                        {lockedVisibility ? <p className="text-danger"> Visibility locked!</p> : ""}

                    </Form >
                    <Button className="float-start mb-3 mt-3" onClick={(ev) => handleSubmit(ev)}>Submit</Button>
                    <Button className="float-end mb-3 mt-3"  variant="danger" onClick={() => { setGoBack(true); memeId !== undefined && setDirty(true) }}> Go Back </Button>
                    </Col>
            </Row>

        </Container >


        {/*}*/}</>
}


function TextBoxes(props) {
    let i = 0;
    const mapText = (f) => {
        return (
            <TextBox
                style={props.positions[f - 1].style}
                key={i}
                text={props.text[i++]}
                color={props.color}
                font={props.font}
            />

        )
    }
    return props.field.map(mapText)
}

function TextBox(props) {
    return (
        <Container style={props.style} className="text-container " >
            <Col className="d-flex justify-content-center align-items-center" style={{ "minHeight": "100%" }} >  {/** to keep the text centered */}
                <Figure.Caption className="text-break text-center fs-1" >
                    <p className="fs-1" style={{ color: props.color, fontFamily: props.font }} >{props.text}</p>
                </Figure.Caption>
            </Col>
        </Container>
    );
}

export default Editor;