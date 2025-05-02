import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
    return (
        <div>
            <Header />
            <section className='contact'>
                <h1>Contact</h1>
                <h2>Feel free to contact us</h2>
                <div className="form-contact">
                    <form className='contact-form'>
                       <label for="name">
                        Names:
                        </label>
                    <input type="text" id='name'></input>
                    <label for="Email"> E-mail: </label>
                    <input type='text' id='Email'></input>
                    <label for="Phone" >Phone (optional) :</label>
                    <input type="number" id="Phone" />
                    <label for="message">Message</label>
                    <input type="text" id="Message"></input>
                    </form>
                    <button type="Send">Send</button>    
                    <br></br>                
                </div>
                <p1>
                    Phone:+266 22340
                </p1>
                <br>
                </br>
                <p1>
                    Email: support@maserutechstore.com
                </p1>
            </section>
            <Footer />
        </div>
    );
}

export default Contact;