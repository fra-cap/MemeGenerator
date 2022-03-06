import { Col, Row, Card, Button, Container, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { React, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../App.css';
import { Redirect, NavLink } from 'react-router-dom';
import { Plus } from "react-bootstrap-icons";

function MemesGallery(props) {
    const [selected, setSelected] = useState('');
    const [show, setShow] = useState(false);
    const [copy, setCopy] = useState(false);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Create new Meme
        </Tooltip>
    );

    return <Container className="mt-2">
        {copy && <Redirect to={"/copy/" + selected} strict />}
        {show && <Redirect to={"/show/" + selected} strict />}
        {!props.memes.err && <Row xs={1} md={3} className="g-4" >
            {props.memes.filter((m) => props.loggedIn ? true : m.visible).map((meme) => (
                <Col key={meme.id}>
                    <Card variant="light" className="text-center" border="primary">

                        <Card.Title className="fs-1">{meme.title} <br /></Card.Title>

                        <Card.Footer>
                            <Button variant="primary" onClick={() => { setSelected(meme.id); setShow(true); }}>Show</Button>
                            {props.loggedIn && <Button className="ms-1" variant="warning" onClick={() => { setSelected(meme.id); setCopy(true) }}>Copy</Button>}
                            {props.user !== undefined && props.user.id === meme.author.id && <Button className="ms-1" variant="danger" onClick={() => { props.deleteMeme(meme.id) }}> Delete </Button>}
                        </Card.Footer>
                    </Card>
                </Col>
            ))}

        </Row>}
        {props.loggedIn &&
            <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
            >
                <Button
                    as={NavLink}
                    to="/images" exact
                    variant="primary"
                    id="NewMeme"
                >
                    <Plus width="40" height="50" />
                </Button>
            </OverlayTrigger>
        }
    </Container>
}



export default MemesGallery;