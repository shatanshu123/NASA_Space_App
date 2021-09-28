import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function Navigation() {
  return (
    <Navbar bg="none" variant="dark">
      <Nav className="mr-auto">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/ssc">Satellite Situation Center</Nav.Link>
        <Nav.Link href="/paths">Orbital Paths</Nav.Link>
        <Nav.Link href="/objects">Space Objects</Nav.Link>
        <Nav.Link href="/report">Low-Earth Orbit Report</Nav.Link>
        <Nav.Link href="/library">SSC Library</Nav.Link>
        <Nav.Link href="/about">About Us</Nav.Link>
      </Nav>
    </Navbar>
  );
}
