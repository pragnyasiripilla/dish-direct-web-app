"use client"

import { useEffect, useState } from "react"

interface ClientDateTextProps {
  value: string
  mode?: "date" | "datetime" | "time"
  className?: string
  prefix?: string
}

export function ClientDateText({ value, mode = "date", className, prefix = "" }: ClientDateTextProps) {
  const [formatted, setFormatted] = useState("")

  useEffect(() => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      setFormatted("")
      return
    }

    if (mode === "datetime") {
      setFormatted(date.toLocaleString())
      return
    }

    if (mode === "time") {
      setFormatted(date.toLocaleTimeString())
      return
    }

    setFormatted(date.toISOString().slice(0, 10))
  }, [value, mode])

  return <span className={className}>{formatted ? `${prefix}${formatted}` : ""}</span>
}
