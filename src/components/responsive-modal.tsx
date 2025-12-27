"use client"

import React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

const ResponsiveModalContext = React.createContext<{
  wideEnough: boolean
  disableAnimation: boolean
}>({
  wideEnough: true,
  disableAnimation: false,
})

function ResponsiveModal(props: React.ComponentProps<typeof Dialog> & React.ComponentProps<typeof Drawer>) {
  const wideEnough = useMediaQuery("(min-width: 768px)")
  const Component = wideEnough ? Dialog : Drawer

  const prevWideEnoughRef = React.useRef(wideEnough)
  const [disableAnimation, setDisableAnimation] = React.useState(false)

  React.useEffect(() => {
    if (prevWideEnoughRef.current !== wideEnough) {
      prevWideEnoughRef.current = wideEnough
      setDisableAnimation(true)
      const timeout = setTimeout(() => { setDisableAnimation(false) }, 500)
      return () => clearTimeout(timeout)
    }
  }, [wideEnough])

  return (
    <ResponsiveModalContext value={{ wideEnough, disableAnimation }}>
      <Component {...props} />
    </ResponsiveModalContext>
  )
}

function ResponsiveModalTrigger(props: React.ComponentProps<typeof DialogTrigger> & React.ComponentProps<typeof DrawerTrigger>) {
  const { wideEnough } = React.useContext(ResponsiveModalContext)
  const Component = wideEnough ? DialogTrigger : DrawerTrigger
  return <Component {...props} />
}

function ResponsiveModalClose(props: React.ComponentProps<typeof DialogClose> & React.ComponentProps<typeof DrawerClose>) {
  const { wideEnough } = React.useContext(ResponsiveModalContext)
  const Component = wideEnough ? DialogClose : DrawerClose
  return <Component {...props} />
}

function ResponsiveModalContent(props: React.ComponentProps<typeof DialogContent> & React.ComponentProps<typeof DrawerContent>) {
  const { wideEnough, disableAnimation } = React.useContext(ResponsiveModalContext)
  const Component = wideEnough ? DialogContent : DrawerContent
  return (
    <Component
      {...props}
      style={{
        ...(disableAnimation && { animationDuration: "initial" }),
        ...props.style,
      }}
    />
  )
}

function ResponsiveModalHeader(props: React.ComponentProps<typeof DialogHeader> & React.ComponentProps<typeof DrawerHeader>) {
  const { wideEnough } = React.useContext(ResponsiveModalContext)
  const Component = wideEnough ? DialogHeader : DrawerHeader
  return <Component {...props} />
}

function ResponsiveModalFooter(props: React.ComponentProps<typeof DialogFooter> & React.ComponentProps<typeof DrawerFooter>) {
  const { wideEnough } = React.useContext(ResponsiveModalContext)
  const Component = wideEnough ? DialogFooter : DrawerFooter
  return <Component {...props} />
}

function ResponsiveModalTitle(props: React.ComponentProps<typeof DialogTitle> & React.ComponentProps<typeof DrawerTitle>) {
  const { wideEnough } = React.useContext(ResponsiveModalContext)
  const Component = wideEnough ? DialogTitle : DrawerTitle
  return <Component {...props} />
}

function ResponsiveModalDescription(props: React.ComponentProps<typeof DialogDescription> & React.ComponentProps<typeof DrawerDescription>) {
  const { wideEnough } = React.useContext(ResponsiveModalContext)
  const Component = wideEnough ? DialogDescription : DrawerDescription
  return <Component {...props} />
}

export {
  ResponsiveModal,
  ResponsiveModalTrigger,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalFooter,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
}
