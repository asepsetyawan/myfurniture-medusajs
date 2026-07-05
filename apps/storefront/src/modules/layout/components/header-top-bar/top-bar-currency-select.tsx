"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { updateRegion } from "@lib/data/cart"
import { formatCurrencyLabel } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"
import { useParams, usePathname } from "next/navigation"

type RegionOption = {
  country: string
  regionId: string
  label: string
  currencyCode: string
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M3 4.5 6 7.5 9 4.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function TopBarCurrencySelect({
  regions,
}: {
  regions: HttpTypes.StoreRegion[]
}) {
  const { countryCode } = useParams() as { countryCode: string }
  const currentPath = usePathname().split(`/${countryCode}`)[1] ?? ""
  const [current, setCurrent] = useState<RegionOption | undefined>()

  const options = useMemo(() => {
    return regions
      .flatMap((region) =>
        (region.countries ?? []).map((country) => ({
          country: country.iso_2?.toLowerCase() ?? "",
          regionId: region.id,
          label: country.display_name ?? country.iso_2 ?? "",
          currencyCode: (region.currency_code ?? "usd").toUpperCase(),
        }))
      )
      .filter((option) => option.country)
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [regions])

  useEffect(() => {
    if (!countryCode) {
      return
    }

    const match = options.find((option) => option.country === countryCode)
    setCurrent(match)
  }, [options, countryCode])

  const handleChange = (option: RegionOption) => {
    setCurrent(option)
    updateRegion(option.country, currentPath)
  }

  if (!options.length) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-[#333]">
        {formatCurrencyLabel()}
      </span>
    )
  }

  return (
    <Listbox value={current} onChange={handleChange}>
      <ListboxButton className="flex items-center gap-1.5 text-xs text-[#333] outline-none transition hover:text-[#111]">
        {current ? (
          <>
            <ReactCountryFlag
              svg
              countryCode={current.country}
              style={{ width: "16px", height: "12px", borderRadius: "1px" }}
            />
            <span className="font-medium">{formatCurrencyLabel(current.currencyCode)}</span>
          </>
        ) : (
          <span className="font-medium">{formatCurrencyLabel()}</span>
        )}
        <ChevronDownIcon />
      </ListboxButton>

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ListboxOptions className="absolute left-0 top-full z-[60] mt-1 min-w-[180px] rounded-md border border-[#e8e8e8] bg-white py-1 shadow-lg">
          {options.map((option) => (
            <ListboxOption
              key={`${option.regionId}-${option.country}`}
              value={option}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs text-[#333] data-[focus]:bg-[#f5f5f5]"
            >
              <ReactCountryFlag
                svg
                countryCode={option.country}
                style={{ width: "16px", height: "12px", borderRadius: "1px" }}
              />
              <span>
                {option.label} ({formatCurrencyLabel(option.currencyCode)})
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Transition>
    </Listbox>
  )
}
