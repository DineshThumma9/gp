import { useEffect, useMemo, useState } from 'react'
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
import { Draggable, MotionPathHelper } from 'gsap/all';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import MorphSVGPlugin from 'gsap/MorphSVGPlugin';
import InertiaPlugin from 'gsap/InertiaPlugin';
// @ts-ignore
import * as d3 from 'd3';

gsap.registerPlugin(useGSAP, ScrambleTextPlugin, SplitText, TextPlugin, ScrollTrigger, Flip, DrawSVGPlugin, MotionPathPlugin, MorphSVGPlugin, MotionPathHelper, Draggable, InertiaPlugin); // register the hook to avoid React version discrepancies 

function App() {
  const [count, setCount] = useState(0)
  const { contextSafe } = useGSAP();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [bars, setBars] = useState<{ value: number, id: number }[]>([{ value: 0, id: 0 }]);
 
  const wave1 = "M0,300 Q150,200 300,300 T600,300 T900,300 L900,600 L0,600 Z";

  const wave2 = "M0,300 Q150,400 300,300 T600,300 T900,300 L900,600 L0,600 Z";

const circles = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      const size = Math.floor(Math.random() * 80) + 10;
      // Constrain position so circles don't overflow (600px height, full width)
      // Reserve space for the circle size
      const maxTopPercent = 100 - (size / 600) * 100;
      const maxLeftPercent = 100 - (size / window.innerWidth) * 100;
      
      return {
        id: i,
        size: size,
        top: Math.random() * Math.max(maxTopPercent, 10),
        left: Math.random() * Math.max(maxLeftPercent, 10),
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      };
    });
  }, [count]);



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

  const safeLength = 15;
  const [nodes,setNodes] = useState<{ id: number, x: number, y: number, vx?: number, vy?: number, fx?: number, fy?: number }[]>([]);
  const [links,setLinks] = useState<any[]>([]);
  const simulationRef = useRef<any>(null);
  const initialNodesRef = useRef<any[]>([]);
  const initialLinksRef = useRef<any[]>([]);
  
  useEffect(() => {
    let safeLength = 15;
    const random = Array.from({ length: safeLength }, (_, index) => ({
      value: index + 1,
      id: index,
    })).sort(() => Math.random() - 0.5);
    flushSync(() => {
      setBars(random);
    })
    
    const containerWidth = window.innerWidth;
    const containerHeight = 600;
    const nodeRadius = 25;
    
    const initialNodes = Array.from({ length: safeLength }, (_, i) => ({
      id: i,
      x: Math.random() * (containerWidth - nodeRadius * 2) + nodeRadius,
      y: Math.random() * (containerHeight - nodeRadius * 2) + nodeRadius,
      vx: 0,
      vy: 0,
    }));

    const initialLinks: any[] = [];
    for (let i = 0; i < safeLength; i++) {
      if (i < safeLength - 1) {
        initialLinks.push({ source: i, target: i + 1 });
      }
      const randomTarget = Math.floor(Math.random() * safeLength);
      if (randomTarget !== i) {
        initialLinks.push({ source: i, target: randomTarget });
      }
    }

    initialNodesRef.current = initialNodes;
    initialLinksRef.current = initialLinks;

    const simulation = d3.forceSimulation(initialNodes)
      .force("link", d3.forceLink(initialLinks).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(containerWidth / 2, containerHeight / 2))
      .force("collision", d3.forceCollide().radius(nodeRadius + 10))
      .force("bounds", () => {
        initialNodes.forEach((node: any) => {
          const margin = nodeRadius;
          if (node.x - margin < 0) node.x = margin;
          if (node.x + margin > containerWidth) node.x = containerWidth - margin;
          if (node.y - margin < 0) node.y = margin;
          if (node.y + margin > containerHeight) node.y = containerHeight - margin;
        });
      })
      .on("tick", () => {
        setNodes([...initialNodes]);
        setLinks([...initialLinks]);
      });

    simulationRef.current = simulation;

    return () => simulation.stop();
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

  // ===== STEP 2: DrawSVG + Scale Animation on Mount =====
  useGSAP(() => {
    // Animate nodes popping in
    gsap.from('.ddrag-node', {
      scale: 0,
      transformOrigin: '50% 50%',
      stagger: 0.05,
      duration: 0.5,
      ease: "back.out(1.7)"
    });

    // Animate lines drawing themselves
    gsap.from('.d3-link', {
      drawSVG: "0%",
      duration: 1.5,
      stagger: 0.02,
      ease: "power2.inOut"
    });
  }, { dependencies: [] });

  // ===== STEP 3: Send Data Packet Along Path =====
  const sendDataPacket = contextSafe((sourceId: number, targetId: number) => {
    const pathId = `#path-${sourceId}-${targetId}`;
    const packet = document.querySelector("#packet");

    if (!document.querySelector(pathId) || !packet) return;

    gsap.set(packet, { visibility: "visible" });

    gsap.to(packet, {
      duration: 1.5,
      ease: "power1.inOut",
      motionPath: {
        path: pathId,
        align: pathId,
        alignOrigin: [0.5, 0.5],
        autoRotate: false,
      },
      onComplete: () => {
        gsap.set(packet, { visibility: "hidden" });
        gsap.to(`.node-${targetId}`, {
          scale: 1.5,
          fill: "yellow",
          yoyo: true,
          repeat: 1,
          duration: 0.2
        });
      }
    });
  });

  // ===== STEP 4: Add Random Node with Animation =====
  const addRandomNode = contextSafe(() => {
    if (!simulationRef.current || !initialNodesRef.current) return;
    
    const newNode = {
      id: initialNodesRef.current.length,
      x: window.innerWidth / 2,
      y: 300,
      vx: 0,
      vy: 0
    };

    initialNodesRef.current.push(newNode);
    setNodes([...initialNodesRef.current]);
    simulationRef.current.nodes(initialNodesRef.current).alpha(0.3).restart();

    setTimeout(() => {
      gsap.from(`.node-${newNode.id}`, {
        scale: 0,
        transformOrigin: "50% 50%",
        ease: "elastic.out(1, 0.3)",
        duration: 1
      });
    }, 50);
  });

  // ===== STEP 5: GSAP Draggable with D3 Physics Bridge =====
  useGSAP(() => {
    if (!simulationRef.current || !initialNodesRef.current) return;

    Draggable.create(".ddrag-node", {
      type: "x,y",
      inertia: true,
      onDragStart: function() {
        const id = parseInt(this.target.getAttribute('data-id') || '0');
        const node = initialNodesRef.current.find((n: any) => n.id === id);
        
        if (simulationRef.current) {
          simulationRef.current.alphaTarget(0.3).restart();
        }
        
        if(node) {
          node.fx = node.x;
          node.fy = node.y;
        }
      },
      onDrag: function() {
        const id = parseInt(this.target.getAttribute('data-id') || '0');
        const node = initialNodesRef.current.find((n: any) => n.id === id);
        
        if(node) {
          node.fx = this.pointerX;
          node.fy = this.pointerY;
        }
      },
      onDragEnd: function() {
        const id = parseInt(this.target.getAttribute('data-id') || '0');
        const node = initialNodesRef.current.find((n: any) => n.id === id);
        
        if (simulationRef.current) {
          simulationRef.current.alphaTarget(0);
        }
        if(node) {
          node.fx = null;
          node.fy = null;
        }
        
        gsap.set(this.target, { clearProps: "transform" });
      }
    });
  }, { dependencies: [nodes.length] });



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

  
    Draggable.create(".drag", {
      type: "x,y",
      bounds: ".drag-container",
      activeCursor:"grabbing",
      edgeResistance: 0.65,
      dragResistance:0.4,
      inertia: true,
      onClick:() => {
        gsap.to(".drag", {
          rotation: "+=360",
          scale:1.5,
          duration: 3,
        })
      },
      onDragEnd:() => {
          gsap.to(".drag", {
            x:10,
            y:5,
            yoyo:true,
            repeat:2,
            rotation:"+=15",

      })
      }



    })

gsap.from('.ddrag', {
    scale: 0,
    transformOrigin: '50% 50%',
    stagger: 0.05,
    duration: 0.5,
    ease: "back.out(1.7)"
  });

  // Animate lines drawing themselves
  gsap.from('.d3-link', {
    drawSVG: "0%",
    duration: 1.5,
    stagger: 0.02,
    ease: "power2.inOut"
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


    gsap.set('.logo', {
      strokeWidth: 2,
      drawSVG: '0% 0%',
    });

    gsap.to(".logo", {
      scrollTrigger: {
        trigger: '.logo',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      duration: 2.5,
      ease: 'power2.out',
      drawSVG: '0% 100%',
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

            <section className="flex flex-col justify-center items-center font-bold font-sans text-[#121212] bg-amber-100 m-25 rounded-lg p-12">
              <h3 className='m-1 p-3'>To <code>gsap.to({ })</code></h3>
              <h3 className='m-1 p-3'>Start from To({ }) props get to default values we have defined</h3>
              <div id="tobox" className='w-[100px] flex h-[100px] text-center bg-red-500 justify-center items-center content-center rounded-lg'>
                <h4>Am a To Box </h4>
              </div>
            </section>

            <section className="flex flex-col justify-center items-center font-bold font-sans text-[#121212] bg-amber-100 m-25 rounded-lg p-12 ">
              <h3 className='m-1 p-3'>FromTo (gsap.fromTo({ }))</h3>
              <h3 className='m-1 p-3'>Starts from from({ }) props and ends to To({ }) props</h3>
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
        <svg width="100%" height="600" viewBox="0 0 900 600" preserveAspectRatio="none">

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
      <div className='w-full h-[600px] drag-container bg-black relative'>
           {
            circles.map((circle) => (
              <div key={circle.id}  className='absolute rounded-full drag' style={{ width: `${circle.size}px`, height: `${circle.size}px`, top: `${circle.top}%`, left: `${circle.left}%`, backgroundColor: circle.color }}></div>
            ))
           }
    
      </div>
      
      <div className='w-full h-[600px] mt-10 ddrag-container bg-black relative' id='d3-graph-container'>
        <svg width="100%" height="100%" style={{ display: 'block' }}>
          {/* Links First (behind circles) */}
          {links.map((link: any, index: number) => {
            const sourceNode = link.source;
            const targetNode = link.target;
            if (!sourceNode || !targetNode) return null;
            
            return (
              <path
                key={`link-${index}`}
                id={`path-${sourceNode.id}-${targetNode.id}`}
                className="d3-link"
                d={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node: any) => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <circle
                className='ddrag-node'
                data-id={node.id}
                cx="0"
                cy="0"
                r="25"
                fill="#4dabf7"
                stroke="#fff"
                strokeWidth="2"
              />
            </g>
          ))}

          {/* Packet for MotionPath */}
          <circle id="packet" r="6" fill="yellow" style={{ visibility: "hidden" }} />
        </svg>
        
        {/* Control Buttons */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 100,
          display: 'flex',
          gap: '10px'
        }}>
          <button onClick={() => sendDataPacket(0, 5)} style={{
            padding: '8px 16px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}>
            Send Packet
          </button>
          <button onClick={addRandomNode} style={{
            padding: '8px 16px',
            background: '#51cf66',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}>
            Add Node
          </button>
        </div>
      </div>

    </>
  )
}

export default App;
