import { useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Meme from "./Meme";
import { Redirect } from "react-router-dom";
import API from "../API";
import 'bootstrap/dist/css/bootstrap.min.css';

function MemeShow(props) {
    const [goBack, setGoBack] = useState(false);
    const [meme, setMeme] = useState(undefined);
    const [positions, setPositions] = useState({});
    const {setDirty, setLoading, memeId, handleErrors} = props;
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const firstMount = async () => {
            setMounted(true);
            setLoading(true);
        }

        const fetchData = async () => {
            try {
                const pos = await API.getPositions();
                
                setPositions(pos);
                const m = await API.getMeme(memeId);
                setMeme(m);

            } catch (error) {
                handleErrors(error);
                setGoBack(true);
                //console.log(error.error)
            }
        }
        !mounted && firstMount().then( () =>fetchData()).then( () =>  setLoading(false));;
    }, [handleErrors,setLoading,memeId, mounted]);

    return (<>
        {goBack && <Redirect to="/" strict />}
        {meme &&
            <Container fluid >
                <Row>
                    <Col className="pt-3 d-flex justify-content-center" sm={8} >
                        <Meme meme={meme} positions={positions} />
                    </Col>
                    <Col className="bg-light pt-3 d-none d-sm-block relative-container center-align" sm={4} >
                        <p className="fs-1 fw-bold">{meme.title}</p>
                        <p> Visibility : {meme.visible ? <>public</> : <>private </>}</p>
                        <span className="fst-italic">  Created by : {meme.author.name}</span> <br />

                        <Button className="back-button" variant="danger" onClick={() => { setGoBack(true); setDirty(true) }}> Go Back </Button>
                    </Col>

                </Row>
            </Container>}
    </>
    );


}


export default MemeShow;