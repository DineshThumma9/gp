import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import { useRef } from 'react'
import TextPlugin from "gsap/TextPlugin"; // used for text animations (bonus plugin)

gsap.registerPlugin(useGSAP,ScrambleTextPlugin,SplitText,TextPlugin); // register the hook to avoid React version discrepancies 

function App() {
  const [count, setCount] = useState(0)
  const {contextSafe} = useGSAP();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const gridColumns = 4;
  const gridItemSize = 88;
  const gridGap = 12;
  const gridPadding = 16;
  const gridSquareSize = gridColumns * gridItemSize + (gridColumns - 1) * gridGap + gridPadding * 2;
  const gridCircleSize = Math.ceil(gridSquareSize * Math.SQRT2) + 24;

  const setGridItemRef = (index: number) => (element: HTMLDivElement | null) => {
    gridItemRefs.current[index] = element;
  };


  const onClick = contextSafe(() => {
    gsap.to(circleRef.current, {

      x: 100,
      y: 100,
      rotation:"+=360",
      color: "white",
      duration: 5,
      background: "pink",
      width: 200,
      height: 200,
      yoyo:true,
      stagger:0.2,
      repeat:0,
      overwrite:true,
      repeatDelay:2,
      


    });

  });




  useGSAP(() => {

    gsap.fromTo('#fromtobox', {

      x: 0,
      y: 0,
      rotation: 0,
      color: "white",
      duration: 10,
      background: "pink",

    }, {

      x: 360,
      y: 100,
      rotation: 270,
      color: "white",
      duration: 5,
      fontSize: 34,
      fontFamily: "bold",
      background: "black",
      translateX: -100,
      size: 200



    });


    // split elements with the class "split" into words and characters
let split = SplitText.create(titleRef.current, { type: "words, chars" });

// now animate the characters in a staggered fashion
gsap.from(split.chars, {
  duration: 1, 
  y: 100,       // animate from 100px below
  autoAlpha: 0, // fade in from opacity: 0 and visibility: hidden
  stagger: 0.05 // 0.05 seconds between each
});



  gsap.from('#heading', {
    
   scrambleText:"101010",
    duration: 2,
    delay: 1,
    ease: "none",
    onStart: () => console.log("Scramble animation started"),
    onUpdate: () => console.log("Scramble animation updated"),
    onComplete: () => console.log("Scramble animation completed"),
    
  })



   gsap.to(textRef.current, {

    duration: 3,
    ease: "ease.inOut",
    
    text:{
      value:"This is a text animation using the TextPlugin.",
      delimiter:"  ",
      newClass:"text-2xl text-red-500 font-bold ",
     },
    });



    gsap.to('#tobox', {

      x: 100,
      y: 100,
      rotation: 180,
      color: "white",
      duration: 5,
      background: "pink",
      width: 200,
      height: 200,
      yoyo:true,
      stagger:0.2,
      repeat:0,
      repeatDelay:2,


    });



    const gridTimeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    gridTimeline.to(gridContainerRef.current, {
      rotation: 360,
      color: "white",
      duration: 2,
      background: "blue",
      overflow: "hidden",
    });

    gridTimeline.to(
      gridItemRefs.current,
      {
        rotation: -360,
        color: "white",
        duration: 1.5,
        background: "yellow",
        borderRadius: "50%",
        scale: 1,
        stagger: {
          each: 0.05,
          from: "center",
          grid: "auto",
          ease: "power2.inOut",
        },
      },
      "<"
    );

    gridTimeline.to(
      gridContainerRef.current,
      {
        borderRadius: "50%",
        duration: 1.2,
      },
      ">-0.2"
    );


    gsap.from('#frombox', {

      x: 100,
      y: 100,
      rotation: 180,
      color: "white",
      duration: 5,
      background: "pink",
      width: 200,
      height: 200,





    });


    gsap.to("#circle" ,{
        x:800,
        y:100,
        rotation:360,
        color:"black",
        duration:1,

        background:"pink",
        clip:50,
        translateX:-100,
        repeat:0,
        yoyo:true,
        translateY:100,
        repeatDelay:1,
        immediateRender:true,
        overwrite:true,
        onComplete:() => {
          console.log("Animation Completed")
          
        },
        onStart:() => {
          console.log("Statered")
        },
        onUpdate:() => {
            console.log("Updates")
        },
        onRepeat:() => {
            console.log("Repeat")
        },
        onRepeatDelay:() => {
            console.log("Repeat Delay")
        },
        onReverseComplete:() => {
            console.log("Reverse Complete")
        },
       
    })

  
  },



  ); // <-- scope is for selector text (optional)


  return (
    <>
      <section id="center">
        <div className="hero">


        </div>
        <div>
          <h1>Get started</h1>
          <p>


              <div className='m-10 p-10'>
          
            </div>
            <h3>From <code>gsap.from({})</code></h3>
            <h3>Start from from({}) props get to default values we have defined</h3>
            <div id="frombox" className='w-25 flex h-25 text-center  bg-red-500 justify-center items-center  content-center rounded-lg'>
              <h4>Am a From Box </h4>
            </div>
          
            <div className='m-10 p-10'>
            <hr/>
            </div>
            <h3>To <code>gsap.to({})</code></h3>
            <h3>Start from To({}) props get to default values we have defined</h3>
            <div id="tobox" className='w-25 flex h-25 text-center  bg-red-500 justify-center items-center  content-center rounded-lg'>
              <h4>Am a To Box </h4>
            </div>
              <div className='m-10 p-10'>
            <hr/>
            </div>
            <h3>FromTo (gsap.fromTo({})</h3>

            <h3>Starts from from({}) props and ends to To({}) props</h3>
            <div id="fromtobox" className='w-25 flex h-25 text-center  bg-red-500 justify-center items-center  content-center rounded-lg'>
              <h4>Am a From To Box </h4>
            </div>
              <div className='m-10 p-10'>
            <hr/>
            </div>
            <div>
              <h1 ref={titleRef}>Animate with GSAP</h1>
              <div>

<h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>
<h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>
<h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>
<h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>
<h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>
<h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>



              </div>
            </div>

            <div id="text-container" className="text-center flex justify-center items-center m-10 font-bold bg-green-400 text-white p-10 rounded-lg max-w h-12.5">


            
              <h2 ref={textRef}>Text Part by GSAP</h2>
            </div>
            <div
              id="grid-container"
              ref={gridContainerRef}
              className='grid grid-cols-4 gap-3 place-items-center overflow-hidden rounded-3xl bg-red-200 p-4 m-5'
              style={{
                width: `${gridCircleSize}px`,
                height: `${gridCircleSize}px`,
                maxWidth: `${gridCircleSize}px`,
                maxHeight: `${gridCircleSize}px`,
              }}
            >
              {Array.from({ length: 16 }, (_, index) => (
                <div
                  key={index}
                  ref={setGridItemRef(index)}
                  className='grid-child flex h-22 w-22 items-center justify-center rounded-2xl bg-red-500 font-bold text-white'
                >
                  Box {index + 1}
                </div>
              ))}
            </div>

          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>

        <div>
          <div id="circle" onClick = {onClick} ref = {circleRef} className="w-25 h-25 flex justify-center items-center rounded-4xl bg-amber-200">
            Circle
          </div>
        </div>
      </section> 

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
