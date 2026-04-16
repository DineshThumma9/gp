import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";
import Flip from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { useRef } from 'react'
import TextPlugin from "gsap/TextPlugin"; // used for text animations (bonus plugin)
import { flushSync } from 'react-dom'

gsap.registerPlugin(useGSAP,ScrambleTextPlugin,SplitText,TextPlugin,ScrollTrigger,Flip); // register the hook to avoid React version discrepancies 

function App() {
  const [count, setCount] = useState(0)
  const {contextSafe} = useGSAP();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [bars,setBars] = useState<{value:number,id:number}[]>([{value:0,id:0}]);


  const onFlipClick = contextSafe(() => {
    if (bars.length < 2) return;

    const firstIndex = Math.floor(Math.random() * bars.length);
    let secondIndex = Math.floor(Math.random() * bars.length);

    while (secondIndex === firstIndex) {
      secondIndex = Math.floor(Math.random() * bars.length);
    }

    const rand1 = bars[firstIndex];
    const rand2 = bars[secondIndex];

    const target1 = `[data-flip-id="${rand1.id}"]`;
    const target2 = `[data-flip-id="${rand2.id}"]`;

    const firstElement = document.querySelector(target1);
    const secondElement = document.querySelector(target2);

    if (!firstElement || !secondElement) return;

    gsap.fromTo(
      [firstElement, secondElement],
      {
        y: 0,
        backgroundColor: "#7e22ce",
      },
      {
        y: 100,
        backgroundColor: "yellow",
        duration: 3,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          const flipped = Flip.getState([firstElement, secondElement]);

          flushSync(() => {
            setBars((prevBars) => {
              const nextBars = [...prevBars];
              [nextBars[firstIndex], nextBars[secondIndex]] = [nextBars[secondIndex], nextBars[firstIndex]];
              return nextBars;
            });
          });

          gsap.set([firstElement, secondElement], {
            clearProps: "backgroundColor",
          });

          Flip.from(flipped, {
            duration: 5,
            ease: "power1.inOut",
            
            stagger: 0.1,
            absolute: true,
            onComplete: () => {
              gsap.set([firstElement, secondElement], {
                clearProps: "transform",
              });
            },
          });
        },
      }
    );

  });

  
  useEffect(() => {
  let safeLength = 15;
    const random = Array.from({ length: safeLength }, (_, index) => ({
      value: index + 1,
      id: index,
    })).sort(() => Math.random() - 0.5);
  flushSync(() => {

    setBars(random); 
  })
  },[ ]);


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


  const onStaggerClick = contextSafe(() => {


  })



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
  scrollTrigger: {
    trigger: titleRef.current,
    start: "top top",
    pin: true,
    end: "+=500", // adjust as needed to control the duration of the pin
    scrub:1,
  }, // trigger the animation when the title comes into view
  duration: 1, 
  y: 100,       // animate from 100px below
  autoAlpha: 0, // fade in from opacity: 0 and visibility: hidden
  stagger: 0.05 // 0.05 seconds between each
});



  gsap.from('#heading', {

      scrollTrigger: {
    trigger: titleRef.current,
    start: "top top",
    pin: true,
    end: "+=500", // adjust as needed to control the duration of the pin
    scrub:1,
  }, // trigger the animation when the title comes into view

   scrambleText:"101010",
    duration: 2,
    delay: 1,
    ease: "none",
    stagger:{
      each:0.5,
      from:"start",
      grid:"auto",
    
    },
    opacity:0,
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



      gsap.from("#grid-container",{
        

      
        color:"white",
  scrollTrigger: {
    trigger: '#grid-container',
    start: "top top",
    pin: true,
    end: "+=500", // adjust as needed to control the duration of the pin
    scrub:1,
  }, // trigger the animation when the title comes into view
        duration:2,
        opacity:0,
        stagger:{
        each:0.05,
        from:"center",
        grid:"auto",
        },
        ease:"power2.inOut",
        background:"blue",



      })



    gsap.from("#grid-child",{

        scrollTrigger: {
    trigger: '#grid-container',
    start: "top top",
    pin: true,
    end: "+=500", // adjust as needed to control the duration of the pin
    scrub:1,
  }, // trigger the animation when the title comes into view

        rotation:-360,
        color:"orange",
        duration:5,
        opacity:100,
        stagger:{
        each:0.5,

        from:"center",
        grid:"auto",
        },
        background:"yellow",
        borderRadius:"50%",
        text:{
          value:"Circles",
          delimiter:"  ",
          
          newClass:"text-2xl text-black font-bold ",
          
        }
    })



    gsap.to("#grid-child1",{
        rotation:-360,
        color:"yellow",
        duration:2,
        stagger:0,
        background:"orange",
        borderRadius:"50%",
    })


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
            <div id="frombox" className='w-[100px] flex h-[100px] text-center  bg-red-500 justify-center items-center  content-center rounded-lg'>
              <h4>Am a From Box </h4>
            </div>
          
            <div className='m-10 p-10'>
            <hr/>
            </div>
            <h3>To <code>gsap.to({})</code></h3>
            <h3>Start from To({}) props get to default values we have defined</h3>
            <div id="tobox" className='w-[100px] flex h-[100px] text-center  bg-red-500 justify-center items-center  content-center rounded-lg'>
              <h4>Am a To Box </h4>
            </div>
              <div className='m-10 p-10'>
            <hr/>
            </div>
            <h3>FromTo (gsap.fromTo({})</h3>

            <h3>Starts from from({}) props and ends to To({}) props</h3>
            <div id="fromtobox" className='w-[100px] flex h-[100px] text-center  bg-red-500 justify-center items-center  content-center rounded-lg'>
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

            <div id="text-container" className="text-center flex justify-center items-center m-10 font-bold bg-green-400 text-white p-10 rounded-lg max-w h-[50px]">


            
              <h2 ref={textRef}>Text Part by GSAP</h2>
            </div>


            <div id="grid-container" className='grid grid-cols-6 justify-center items-center rounded-2xl grid-rows-4 w-fit h-fit m-5 p-10  gap-4'>


              <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
              
              <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div >    
              
              
              
              <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div >  
              
              
              <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div >    
              
              
              <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
               <div id="grid-child" className='w-[100px] h-[100px] bg-red-500 flex justify-center items-center text-white font-bold rounded-lg'>
                Box 1
              </div > 
             
              
              
              
              
            </div>
            <div>
              <button id="stagger-button"  className='bg-blue-500 w-fit text-amber-100 m-9 p-3 px-10  h-fit  rounded-2xl' onClick={onStaggerClick}>
                Stagger
              </button>
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
          <div id="circle" onClick = {onClick} ref = {circleRef} className="w-[100px] h-[100px] flex justify-center items-center rounded-4xl bg-amber-200">
            Circle
          </div>
        </div>
      </section> 
      <div className='flex flex-col bg-purple-200'>
        <div className='flex flex-col w-[80%] h-fit m-10 p-10' >
          <div className='w-[200px] h-[200px] bg-amber-300 text-black p-3 m-5 flex flex-col justify-center items-center text-center font-bold rounded-lg'>
            Alt Box1
          </div>
          <div className='w-[200px] h-[200px] bg-amber-300 text-black p-3 m-5 flex flex-col justify-center items-center text-center font-bold rounded-lg self-end'>
            Alt Box1
          </div>
          <div className='w-[200px] h-[200px] bg-amber-300 text-black p-3 m-5 flex flex-col justify-center items-center text-center font-bold rounded-lg'>
            Alt Box1
          </div>
          <div className='w-[200px] h-[200px] bg-amber-300 text-black p-3 m-5 flex flex-col justify-center items-center text-center font-bold rounded-lg self-end'>
            Alt Box1
          </div>
          <div className='w-[200px] h-[200px] bg-amber-300 text-black p-3 m-5 flex flex-col justify-center items-center text-center font-bold rounded-lg'>
            Alt Box1
          </div>
         

        </div>
        
        <div className='flex flex-col font-bold text-2xl'>

          <h1 className='flex flex-col font-bold text-2xl'>
            Scroll Smoother
          </h1>

        </div>
      </div>
      <div className="flex flex-col w-fit h-fit m-10 p-10">


      <div className='flex items-end  flex-row w-fit h-fit'> 

        {
          bars.map((bar)=>(
            <div className={`flex justify-center align-center bar items-center rounded-t-xl align-baseline text-white p-4 m-2 bg-purple-700 w-[50px]`} key={bar.id} data-flip-id={bar.id.toString()} style={{height:`${bar.value*10}px`}}>
              {bar.value}
            </div>
          ))
        }

        </div>


        <div>
          <button className='w-fit h-fit m-5 p-3 bg-amber-700 text-amber-100' onClick={onFlipClick}>
            Flip Random 2
          </button>
        </div>


      </div>

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
