import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

const useGsapAnimation = (aniConfig, triggerConfig, multiple = false) => {
  const ref = useRef(null)

  useEffect(() => {
    let ctx
    if (ref.current) {
      ctx = gsap.context(() => {
        const targets = multiple ? ref.current.children : ref.current

        gsap.fromTo(
          targets,
          aniConfig.from,
          {
            ...aniConfig.to,
            scrollTrigger: {
              trigger: ref.current,
              ...triggerConfig,
            },
          }
        )
      }, ref)

      // Cleanup on unmount
      return () => {
        ctx && ctx.revert()
      }
    }
  }, [aniConfig, triggerConfig, multiple])

  return ref
}

export default useGsapAnimation