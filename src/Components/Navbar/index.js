import "./navbar.css";
export default function Navbar(props) {
    return (
        <nav class="navbar">
            <a class="active" href="#"> Business Card Maker</a>
           {props.children}
        </nav>
    );
}