import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/About.css";

const About = () => {
    return (
        <div className="about-wrapper">
            <Header />
            <section className="About-page">
                <h1>About Us</h1>
                <div className="Paragraph">
                <p>
                    We are a private company, and we specialize in providing Basotho with
                    amazing technology accessories with a variety of technologies including
                    smart phones, laptops and many more available.
                </p>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default About;