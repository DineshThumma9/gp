import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";
import Flip from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { useRef } from 'react'
import TextPlugin from "gsap/TextPlugin"; // used for text animations (bonus plugin)
import { flushSync } from 'react-dom'
import DrawSVGPlugin from "gsap/DrawSVGPlugin"; // used for SVG path animations (bonus plugin)
import { MotionPathHelper } from 'gsap/all';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import MorphSVGPlugin from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(useGSAP, ScrambleTextPlugin, SplitText, TextPlugin, ScrollTrigger, Flip, DrawSVGPlugin, MotionPathPlugin, MorphSVGPlugin,MotionPathHelper); // register the hook to avoid React version discrepancies 

function App() {
  const [count, setCount] = useState(0)
  const { contextSafe } = useGSAP();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [bars, setBars] = useState<{ value: number, id: number }[]>([{ value: 0, id: 0 }]);

  const wave1 = "M0,300 Q150,200 300,300 T600,300 T900,300 L900,600 L0,600 Z";

  const wave2 = "M0,300 Q150,400 300,300 T600,300 T900,300 L900,600 L0,600 Z";





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
        duration: 5,
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

          // Keep bars yellow during Phase 2 (don't clear backgroundColor)

          Flip.from(flipped, {
            duration: 5,
            ease: "power1.inOut",
            // Don't set backgroundColor here - bars already yellow from Phase 1
            fade: true,
            zIndex: 10,
            stagger: 0.1,
            absolute: false,
            onComplete: () => {
              // After flip completes, return to purple
              gsap.to([firstElement, secondElement], {
                clearProps: "transform",
                duration: 5,
                y: 12,
                backgroundColor: "#7e22ce", // Back to purple
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
  }, []);


  const onClick = contextSafe(() => {
    gsap.to(circleRef.current, {

      x: 100,
      y: 100,
      rotation: "+=360",
      color: "white",
      duration: 5,
      background: "pink",
      width: 200,
      height: 200,
      yoyo: true,
      stagger: 0.2,
      repeat: 0,
      overwrite: true,
      repeatDelay: 2,



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

      scrollTrigger: {
        trigger: '#fromtobox',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },

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
        scrub: 1,
      }, // trigger the animation when the title comes into view
      duration: 1,
      y: 100,       // animate from 100px below
      autoAlpha: 0, // fade in from opacity: 0 and visibility: hidden
      stagger: 0.05 // 0.05 seconds between each
    });



     
    gsap.to("#wave-path", {
      attr: { d: wave2 },
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      scrollTrigger: {
        trigger: '#wave-path',
        start: 'top 85%',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      }

    });

  

  

    let splitChars = SplitText.create('#scroll-smoother', { type: "chars" });

    gsap.fromTo(splitChars.chars, {
      y: 50,

    }, {
      y: 0,

      duration: 3,
      fontSize: 54,
      fontWeight: "900",
      color: "white",
      scrollTrigger: {
        trigger: '#scroll-smoother',
        start: "top center",
        scrub: 1,
        end: "+=200",

      },
      textShadow: "-2px -2px 0 #000, -2px -1px 0 #000, -2px 0px 0 #000, -1px -2px 0 #000, -1px -1px 0 #000, -1px 0px 0 #000, 0px -2px 0 #000, 0px -1px 0 #000, 2px 0px 0 #000, 2px 1px 0 #000, 2px 2px 0 #000, 1px 2px 0 #000, 0px 2px 0 #000, 3px 3px 0 #000, 4px 4px 0 #000, 5px 5px 0 #000",
      ease: "power2.out",

    });


    gsap.from('#heading', {

      scrollTrigger: {
        trigger: titleRef.current,
        start: "top center",
        end: "+=400",
        scrub: 1,
      }, // trigger the animation when the title comes into view

      scrambleText: "101010",
      duration: 2,
      delay: 1,
      ease: "none",
      stagger: {
        each: 0.5,
        from: "start",
        grid: "auto",

      },
      opacity: 0,
      onStart: () => console.log("Scramble animation started"),
      onUpdate: () => console.log("Scramble animation updated"),
      onComplete: () => console.log("Scramble animation completed"),

    })


    gsap.set('.sq', {
      x: 0,
      y: 0,
      rotation: 0,
      transformOrigin: '50% 50%',
      drawSVG: '0% 0%',
      fill: 'transparent',
      stroke: '#ef4444',
    });

    gsap.set('.svg-shell', {
      rotation: 0,
      borderRadius: '12px',
      backgroundColor: '#0f172a',
      transformOrigin: '50% 50%',
    });

    const getCornerTravel = () => {
      const host = document.querySelector('.svg-shell');
      const square = document.querySelector('.sq');

      if (!host || !square) {
        return { x: 0, y: 0 };
      }

      const hostRect = host.getBoundingClientRect();
      const squareRect = square.getBoundingClientRect();

      const currentCenterX = squareRect.left + squareRect.width / 2;
      const currentCenterY = squareRect.top + squareRect.height / 2;

      // Place the square outside the host so its inner corner "hits" the host corner.
      const targetCenterX = hostRect.right + squareRect.width / 2;
      const targetCenterY = hostRect.top - squareRect.height / 2;

      return {
        x: targetCenterX - currentCenterX,
        y: targetCenterY - currentCenterY,
      };
    };

    const drawChainTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.draw-chain-wrap',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      defaults: {
        ease: 'power2.inOut',
      },
    });

    drawChainTl
      .fromTo(
        '.sq',
        {
          transformOrigin: '50% 50%',
        },
        {
          drawSVG: '0% 100%',
          duration: 1.0,
          ease: 'power1.out',
        }
      )
      .to('.sq', {
        fill: '#facc15',
        stroke: '#3b82f6',
        duration: 0.35,
      })
      .to(
        '.svg-container',
        {
          duration: 1.15,
          rotation: 360,
          transformOrigin: '50% 50%',
        },
        '>-0.05'
      )
      .to('.svg-shell', {
        duration: 0.45,
        borderRadius: '50%',
        backgroundColor: '#fb923c',
      }, '<')
      .to(
        '.sq',
        {
          duration: 1.9,
          x: () => getCornerTravel().x,
          y: () => getCornerTravel().y,
          rotation: 990,
          ease: 'power3.in',
        },
        '>'
      );



    gsap.to(textRef.current, {

      scrollTrigger: {
        trigger: '#text-container',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },


      duration: 3,
      ease: "ease.inOut",

      text: {
        value: "This is a text animation using the TextPlugin.",
        delimiter: "  ",
        newClass: "text-2xl text-red-500 font-bold ",
      },
    });



    gsap.to('#tobox', {

      scrollTrigger: {
        trigger: '#tobox',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },

      x: 100,
      y: 100,
      rotation: 180,
      color: "white",
      duration: 5,
      background: "pink",
      width: 200,
      height: 200,
      yoyo: true,
      stagger: 0.2,
      repeat: 0,
      repeatDelay: 2,


    });



    gsap.to("#grid-container", {



      color: "white",
      scrollTrigger: {
        trigger: '#grid-container',
        start: "top center",
        end: "+=400",
        scrub: 1,
      }, // trigger the animation when the title comes into view
      duration: 5,

      stagger: {
        each: 0.05,
        from: "center",
        grid: "auto",
      },
      ease: "power2.inOut",
      background: "blue",



    })


    gsap.to(".alt-box", {
      scrollTrigger: {
        trigger: '#alt-container',
        start: "top center",
        end: "+=400",
        scrub: 1,
      }, // trigger the animation when the title comes into view
      duration: 5,
      background: "green",
      color: "white",
      scale: 1.2,
      stagger: {
        grid: "auto",
        each: 0.2,
        from: "start",
      },
      borderRadius: "50%",

    })



    gsap.to("#grid-child", {

      scrollTrigger: {
        trigger: '#grid-container',
        start: "top center",
        end: "+=400",
        scrub: 1,

      }, // trigger the animation when the title comes into view

      rotation: -360,

      color: "orange",
      duration: 5,

      stagger: {
        each: 0.5,

        from: "center",
        grid: "auto",
      },
      background: "yellow",
      borderRadius: "50%",
      text: {
        value: "Circles",
        delimiter: "  ",

        newClass: "text-2xl text-black font-bold ",

      }
    })


    gsap.to(".logo", {

      duration:5,
      ease:'power2.inOut',
      stagger:0.5,
      drawSVG: "100% 100%",


    });



    gsap.to("#grid-child1", {
      scrollTrigger: {
        trigger: '#grid-container',
        start: 'top 80%',
        end: 'bottom top',
        scrub: 1,
      },
      rotation: -360,
      color: "yellow",
      duration: 2,
      stagger: 0,
      background: "orange",
      borderRadius: "50%",
    })


    gsap.from('#frombox', {

      scrollTrigger: {
        trigger: '#frombox',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },

      x: 100,
      y: 100,
      rotation: 180,
      color: "white",
      duration: 5,
      background: "pink",
      width: 200,
      height: 200,





    });


    // Draw the boat paths when the section enters, then keep boat and waves moving subtly.
    const drawBoatTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#draw-me',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    drawBoatTl
      .from('.draw-path', {
        duration: 1.2,
        drawSVG: '0% 0%',
        stagger: 0.16,
        ease: 'power2.out',
      })
      .to(
        '.draw-path',
        {
          fill: '#ffffff',
          duration: 0.4,
          stagger: 0.1,
        },
        '-=0.35'
      );

    gsap.to('.boat-wrap', {
      y: -10,
      rotation: 1.5,
      duration: 2.3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      transformOrigin: '50% 70%',
      scrollTrigger: {
        trigger: '#draw-me',
        start: 'top 80%',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      },
    });

    gsap.to('.wave-layer', {
      xPercent: -5,
      duration: 4.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.25,
      scrollTrigger: {
        trigger: '#draw-me',
        start: 'top 80%',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      },
    });

    gsap.to("#circle", {

      scrollTrigger: {
        trigger: '#circle',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },

      x: 300,
      rotation: 360,
      color: "black",
      duration: 1,

      background: "pink",
      clip: 50,

      repeat: 0,
      yoyo: true,

      repeatDelay: 1,
      immediateRender: true,
      overwrite: true,
      onComplete: () => {
        console.log("Animation Completed")

      },
      onStart: () => {
        console.log("Statered")
      },
      onUpdate: () => {
        console.log("Updates")
      },
      onRepeat: () => {
        console.log("Repeat")
      },
      onRepeatDelay: () => {
        console.log("Repeat Delay")
      },
      onReverseComplete: () => {
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
        <div className="">
          <h1>Get started</h1>
          <div className="demo-sections">
            <section className="flex flex-col justify-center items-center font-semibold font-sans text-[#121212] bg-amber-100 m-25 rounded-lg p-12 ">
               <h3 className='m-1 p-3'>From <code>gsap.from({ })</code></h3>
               <h3 className='m-1 p-3'>Start from from({ }) props get to default values we have defined</h3>
               <div id="frombox" className='w-[100px] flex h-[100px] text-center bg-red-500 justify-center items-center content-center rounded-lg'>
                   <h4>Am a From Box </h4>
                </div>
            </section>

            <section className="flex flex-col justify-center items-center font-bold font-sans text-[#121212] bg-amber-100 m-25 rounded-lg p-12 "className="flex flex-col justify-center items-center font-bold font-sans text-[#121212] bg-amber-100 m-25 rounded-lg p-12 "className="flex flex-col justify-center items-center font-bold font-sans text-[#121212] bg-amber-100 m-25 rounded-lg p-12 ">
              <h3>To <code>gsap.to({ })</code></h3>
              <h3>Start from To({ }) props get to default values we have defined</h3>
              <div id="tobox" className='w-[100px] flex h-[100px] text-center bg-red-500 justify-center items-center content-center rounded-lg'>
                <h4>Am a To Box </h4>
              </div>
            </section>

            <section className="flex flex-col justify-center items-center font-bold font-sans text-[#121212] bg-amber-100 m-25 rounded-lg p-12 ">
              <h3>FromTo (gsap.fromTo({ }))</h3>
              <h3>Starts from from({ }) props and ends to To({ }) props</h3>
              <div id="fromtobox" className='w-[100px] flex h-[100px] text-center bg-red-500 justify-center items-center content-center rounded-lg'>
                <h4>Am a From To Box </h4>
              </div>
            </section>

            <section className="flex flex-col h-fit justify-center items-center font-bold font-sans text-white  rounded-lg p-12 ">
              <h1 className="font-3xl font-bold text-amber-50" ref={titleRef}>Animate with GSAP</h1>
              <div>
                <h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>
                <h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>
                <h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>
                <h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>
                <h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>
                <h2 id="heading"> This is a scramble text animation using the ScrambleTextPlugin.</h2>
              </div>
            </section>

            <div id="text-container" className="text-center flex justify-center items-center font-bold p-10 rounded-lg max-w h-[50px]">


              <h2 ref={textRef}>Text Part by GSAP</h2>
            </div>


            <section className="flex flex-col justify-center items-center">
            <div id="grid-container" className='grid grid-cols-6 justify-center items-center rounded-2xl grid-rows-4 w-fit h-fit m-5 p-10 gap-4'>


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
              <button id="stagger-button" className='bg-blue-500 w-fit text-amber-100 m-9 p-3 px-10  h-fit  rounded-2xl' onClick={onStaggerClick}>
                Stagger
              </button>
            </div>
            </section>

          </div>
        </div>

       
      </section>




      <div className='flex flex-row items-stretch w-full m-25'>
        <div id="alt-container" className=' flex flex-col w-[80%] h-fit m-10 p-10' >
          <div className='w-[200px] h-[200px] alt-box bg-amber-300 text-black p-3 m-5 flex flex-col justify-center items-center text-center font-bold rounded-lg'>
            Alt Box1
          </div>
          <div className='w-[200px] h-[200px] alt-box bg-amber-300 text-black p-3 m-5 flex flex-col justify-center items-center text-center font-bold rounded-lg self-end'>
            Alt Box1
          </div>
          <div className='w-[200px] h-[200px] alt-box bg-amber-300 text-black p-3 m-5 flex flex-col justify-center items-center text-center font-bold rounded-lg'>
            Alt Box1
          </div>
          <div className='w-[200px] h-[200px] alt-box bg-amber-300 text-black p-3 m-5 flex flex-col justify-center items-center text-center font-bold rounded-lg self-end'>
            Alt Box1
          </div>
          <div className='w-[200px] h-[200px] alt-box bg-amber-300 text-black p-3 m-5 flex flex-col justify-center items-center text-center font-bold rounded-lg'>
            Alt Box1
          </div>


        </div>

        <div id="scroll-container" className=' flex w-[20%] flex-col items-center justify-center self-stretch px-6 py-10 font-bold text-2xl'>
          <div id="scroll-smoother" className='flex flex-col items-center w-full gap-1 text-center h-full justify-center'>

            SCROLL SMOOTHER
          </div>

        </div>
      </div>




      <div className="flex flex-col justify-center align-middle items-center p-10">


        <div className='grid grid-cols-[repeat(15,minmax(50px,50px))] gap-2 items-end h-[170px]'>

          {
            bars.map((bar) => (
              <div className={`flex justify-center align-center bar items-center rounded-t-xl align-baseline text-white p-4 m-2 bg-purple-700 w-[50px]`} key={bar.id} data-flip-id={bar.id.toString()} style={{ height: `${bar.value * 10}px` }}>
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


      <section id="spacer"></section>

      <div className='draw-chain-wrap relative w-full h-fit m-6 px-4 flex justify-center items-center align-center content-center bg-green-300 overflow-visible'>
        <div className='svg-shell w-[500px] h-[500px] border-4 border-amber-300 rounded-xl flex justify-center items-center self-center bg-slate-900'>
          <svg width={500} height={500} className='svg-container overflow-visible' fill="none" xmlns="http://www.w3.org/2000/svg">          
            <rect className='sq' width={200} height={200} fill="purple" x={150} y={150} stroke='red' strokeWidth='8' />
          </svg>
        </div>
      </div>

<div className='w-full h-[600px] flex flex-row bg-black'>
  {/* First Mountain */}
<div className='w-full h-[600px] flex items-center justify-center bg-black'>
        <svg width="900" height="600" viewBox="0 0 900 600">

        <path

          id="wave-path"

          d={wave1}

          fill="#0077be"

          stroke="#005a91"

          strokeWidth="2"

        />

      </svg>


</div>
</div>      
      <section className="w-full px-4 pb-10">
        <div
          id="draw-me"
          className="relative mt-8 h-[420px] w-full overflow-hidden rounded-3xl border border-slate-700 bg-black shadow-[0_18px_40px_rgba(15,23,42,0.28)]"
        >
          <div className="absolute left-5 top-5 z-20 rounded-xl bg-white/70 px-4 py-2 backdrop-blur">
            <h2 className="text-2xl font-extrabold text-slate-700">DrawSVG: Boat on Water</h2>
            <p className="text-sm text-slate-600">Boat paths are drawn first, then filled.</p>
          </div>

          <div className="boat-wrap absolute left-1/2 bottom-[36%] z-20 w-[240px] -translate-x-1/2 drop-shadow-[0_10px_14px_rgba(15,23,42,0.35)]">
            <svg className="h-auto w-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                className="draw-path"
                d="M2.5 13C2.5 13 4.5 13 6 13C7.5 13 10.5 13 12 13C13.5 13 16.5 13 18 13C19.5 13 21.5 13 21.5 13L19.5 17H4.5L2.5 13Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="draw-path"
                d="M12 13L11 3L16 8L12 13Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="draw-path"
                d="M11 6L6 6L9 9"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <svg
            className="absolute inset-x-0 bottom-0 h-[72%] w-full"
            viewBox="0 0 200 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path className="wave-layer" d="M0 60 Q 50 40, 100 60 T 200 60 V 100 H 0 Z" fill="#1e3a8a" />
            <path className="wave-layer" d="M0 70 Q 50 50, 100 70 T 200 70 V 100 H 0 Z" fill="#3b82f6" opacity="0.85" />
            <path className="wave-layer" d="M0 80 Q 50 60, 100 80 T 200 80 V 100 H 0 Z" fill="#60a5fa" opacity="0.72" />
          </svg>

        </div>
      </section>
      <div className='w-[100%] h-[100%] flex flex-row bg-black'>
        <div className='w-full h-full flex justify-center items-center text-white font-bold text-4xl'>
          <h1>Hello</h1>
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify logo iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228">
          <path fill="#00D8FF" className="logo" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
        </div>

      </div>
    </>
  )
}

export default App
