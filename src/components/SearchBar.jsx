import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export default function SearchBar({ onSearch }) {
    return (
        <div className="flex flex-1 gap-2 items-center p-2 bg-white rounded-lg w-full min-w-0 shadow-sm">
            <input
                className="flex-1 min-w-0 focus:outline-none"
                type="text"
                placeholder="Buscar por nombre, teléfono o dirección"
                onChange={(e) => onSearch(e.target.value)}
            />
            <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
        </div>
    )
}
