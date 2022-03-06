import { Col, Row, Card, Button } from 'react-bootstrap';
import { React, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../App.css';
import API from './../API';

function ImagesGallery(props) {
    const [submitted, setSubmitted] = useState(false);
    const [selected, setSelected] = useState('');
    const [images,setImages] = useState([]);
    const {setLoading, handleErrors} = props;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const firstMount = async () => {
            setMounted(true);
            setLoading(true);
        }
		const fetchData = async () => {
			try {	
                const imgs = await API.loadImages();
                setImages(imgs);
			} catch (err) {
                handleErrors(err);
				//console.log(err.error); 
			}
		};
        !mounted && firstMount().then( ()=> fetchData()).then( () => setLoading(false));
	}, [setLoading, handleErrors,  mounted]);

    return <>
        {submitted && <Redirect to={"/edit/" + selected} strict/>}
        {images && <Row xs={1} md={5} className="g-4 mt-2">
            {images.map((image) => (
                <Col key={image.id}>
                    <Card>
                        <Card.Img variant="top" src={image.img} />
                        <Card.Body>
                            <Card.Title>{image.title}</Card.Title>
                            <Card.Text>
                                This image contains {image.fieldNumber} text boxes in which you can
                                write.
                            </Card.Text>
                            <Button variant="primary" onClick={() => { setSelected(image.id); setSubmitted(true) }}>Edit</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>}
    </>
}


export default ImagesGallery;