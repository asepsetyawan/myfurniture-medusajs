"use client"

import {
  RajaOngkirDestination,
  searchRajaOngkirDestinations,
} from "@lib/data/rajaongkir"
import Input from "@modules/common/components/input"
import { clx } from "@modules/common/components/ui"
import { useCallback, useEffect, useRef, useState } from "react"

type RajaOngkirDestinationSelectProps = {
  value: RajaOngkirDestination | null
  onChange: (destination: RajaOngkirDestination | null) => void
  required?: boolean
}

const RajaOngkirDestinationSelect = ({
  value,
  onChange,
  required,
}: RajaOngkirDestinationSelectProps) => {
  const [query, setQuery] = useState(value?.label ?? "")
  const [results, setResults] = useState<RajaOngkirDestination[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value?.label) {
      setQuery(value.label)
    }
  }, [value?.id, value?.label])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    // Jangan cari ulang / kosongkan pilihan saat teks sudah sama dengan item terpilih
    if (value?.label && query === value.label) {
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      const destinations = await searchRajaOngkirDestinations(query)
      setResults(destinations)
      setIsLoading(false)
      setIsOpen(true)
    }, 350)

    return () => clearTimeout(timer)
  }, [query, value?.id, value?.label])

  const handleSelect = useCallback(
    (destination: RajaOngkirDestination) => {
      onChange(destination)
      setQuery(destination.label)
      setIsOpen(false)
    },
    [onChange]
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="col-span-2 relative" ref={containerRef}>
      <Input
        label="Area pengiriman (kelurahan/kecamatan)"
        name="rajaongkir_destination_search"
        autoComplete="off"
        value={query}
        onChange={(e) => {
          const next = e.target.value
          setQuery(next)
          if (value && next !== value.label) {
            onChange(null)
          }
        }}
        onFocus={() => {
          if (results.length) {
            setIsOpen(true)
          }
        }}
        required={required}
        data-testid="rajaongkir-destination-input"
      />
      <input
        type="hidden"
        name="shipping_address.metadata.rajaongkir_destination_id"
        value={value?.id != null ? String(value.id) : ""}
      />
      <input
        type="hidden"
        name="shipping_address.metadata.rajaongkir_destination_label"
        value={value?.label ?? ""}
      />

      {isOpen && (results.length > 0 || isLoading) && (
        <ul
          className={clx(
            "absolute z-20 mt-1 w-full max-h-56 overflow-y-auto",
            "bg-white border border-ui-border-base rounded-rounded shadow-elevation-card"
          )}
          data-testid="rajaongkir-destination-results"
        >
          {isLoading && (
            <li className="px-4 py-3 text-small-regular text-ui-fg-muted">
              Mencari...
            </li>
          )}
          {!isLoading &&
            results.map((destination) => (
              <li key={destination.id}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 text-small-regular hover:bg-ui-bg-subtle-hover"
                  onClick={() => handleSelect(destination)}
                >
                  {destination.label}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}

export default RajaOngkirDestinationSelect
