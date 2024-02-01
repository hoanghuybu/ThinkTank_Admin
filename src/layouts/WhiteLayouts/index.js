import './WhiteLayouts.scss';

function WhiteLayouts({ children }) {
    return (
        <section className="vh-100">
            <div className="container-fluid h-100">{children}</div>
        </section>
    );
}

export default WhiteLayouts;
