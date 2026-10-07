import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import Navbar from './Navbar';
import Footer from './Footer';
function scrollToTop() {
    window.scrollTo(0, 0);
}
export default class Home extends React.Component{
    render(){
        return(
        <>
    <Navbar />

    <section className="Main-section">
    <div className="container">
        <div className="row">
            <div className="col-12 col-md-7 col-lg-7 ">
                <p className="main-text">We believe every child should have a clear view! </p>
                <p className="main-text2">Growing up your children with our most smart monitization</p>
                    <a href="#ABT">
                        <button className="btn1"> <span>Know More</span></button>

                    </a>
            </div>
            <div className="col-12 col-md-5 col-lg-5 ">


                <div className="main">
                    <div className="circle"></div>
                </div>
                <div className="main">
                    <div className="circle1"></div>
                </div>
                <div className="home_image1">
                    <img src="images/LazyEyeGirl.jpg" alt="" width="700" height="700" />

                </div>
                <div className="main">
                    <div className="circle2"></div>
                </div>
            </div>
        </div>
    </div>
</section> 




<section className="Page-content container-fluid" id="ABT">
    <div className="row">
        
        <div className="col-11 kn-ab">
            <p className="kn-text"> Lazy Eye (Amblyopia)</p>
            <p className="kn-head"><i className="fa-solid fa-circle-question"></i> What is Amblyopia?</p>
            <p className="kn-cont" >Lazy eye, also known as amblyopia, is one of the most common eye disorders in children. Lazy eye occurs when vision in one (or possibly both) of the eyes is impaired because the eye and the brain are not properly working together. This condition is sometimes confused with strabismus, also known as a misalignment of the eyes.</p>
            <p className="kn-head"><i className="fa-solid fa-circle-question"></i>How is lazy eye diagnosed?</p>
            <p className="kn-cont">Lazy eye is diagnosed through a routine eye exam. Your child’s first eye exam should take place between the ages of 6 and 12 months old. Pediatricians routinely screen for general eye problems.</p>
            <p className="kn-head"><i className="fa-solid fa-circle-exclamation"></i>Lazy Eye Treatment</p>
            <p className="kn-cont">Lazy eye is generally treated by forcing the nonworking eye to work more actively. Lazy eye should be treated in early childhood to prevent it from becoming permanent, but studies have shown that older children may also benefit from treatment.</p>
            <h3><i className="fa-sharp fa-solid fa-star"></i>Eye patch</h3>
            <h3><i className="fa-sharp fa-solid fa-star"></i>Corrective lenses and glasses</h3>
            <h3><i className="fa-sharp fa-solid fa-star"></i>Atropine eye drops</h3>
            <h3><i className="fa-sharp fa-solid fa-star"></i>Surgery</h3>
        </div>
        <div className="col-1">
            <div className="vl"></div>
        </div>
    </div>
</section>


<section id="main-Card">
     <div className="container">
        <div className="card">
          <div className="box">
            <div className="content">
                <img src="https://img.icons8.com/fluency/48/null/smiling.png"/>
              <h3>Happy Patients</h3>
              <h2>80+</h2>
            </div>
          </div>
        </div>
      
        <div className="card">
          <div className="box">
            <div className="content">
                <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/null/external-doctor-vaccines-and-vaccination-flaticons-lineal-color-flat-icons-6.png"/>
                <h3>Associated Doctors</h3>
                <h2>30+</h2>
            </div>
          </div>
        </div>
      
        <div className="card">
          <div className="box">
            <div className="content">
                <img src="https://img.icons8.com/external-color-outline-adri-ansyah/64/null/external-awards-awards-color-outline-adri-ansyah-44.png"/>
                <h3>Awards Won</h3>
                <h2>10+</h2>
            </div>
          </div>
        </div>
      </div>
</section>





<section id="INS" className="container-fluid">
    
        <div className="row">
            <div className="col-12">
                <div className="logo-holder">
                    <div className="bg"></div>
                    <div className="bar"></div>
                    <div className="bar fill1"></div>
                    <div className="bar fill2"></div>
                    <div className="bar fill3"></div>
                    <div className="bar fill4"></div>
                    <div className="bar fill1"></div>
                    <div className="bar fill5"></div>
                    <div className="bar fill6"></div>
                    <div className="bar"></div>
                </div>
            </div>
            <div className="col-12 ins-con" style={{marginTop:'20rem'}}>
                <h1>Instructions <i className="fa-solid fa-check"></i></h1>
                <p>Lazy Eye Games can help on amblyopic\lazy eye. With proper settings the apps are able to force the brain to use the inputs from both eyes simultaneously in this way teach the brain to the proper image processing.
                    In each app you can find a possibility to adjust colors of specific elements of the game.</p>
                <p>e.g.: In Lazy Eye Blocks you can choose one type of color for the falling blocks and another color for the landed blocks.
                    The concept is the same in all games.
                    So as an example in the Lazy Eye Blocks you should choose the best colors what are fit to your 3D glasses.
                    The goal is to make the falling blocks visible to only one eye and the landed blocks visible to only the other one. While you adjusting the falling\landed blocks colors close one of the eyes and see only with the other eye while you trying to pick up the best color.
                    After you picked up the first color open the closed eye and close the previously opened eye and adjust the other color.
                    Always make sure that only one of the eyes can see the left or the right color.
                    Playing the game requires information to be sent to both eyes, making them work cooperatively.</p>
            </div>
        </div>        
    
    </section> 
 
<div className=" webdevanim1" id="contact">
    <div className="row">
       
        <div className="col-12 col-md-6 col-lg-6 order-1 order-md-1 order-lg-1 cont-cont">
            <h3 className="c_head1">Contact Us</h3>
            <p>Email: <a href="">lazyeyegames24*7@gmail.com</a> </p>
            <p>Number: <a href="">9890376644</a> </p>
        </div>
        <div className="col-12 col-md-6 col-lg-6 order-0 order-md-0 order-lg-0">
            <img src="images/contact.png" alt="" className="con-img"/>
        </div>
    </div>
</div>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#26272b" fillOpacity="1" d="M0,96L80,80C160,64,320,32,480,53.3C640,75,800,149,960,165.3C1120,181,1280,139,1360,117.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>



<Footer />
</>
  )
}
}


