import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import classnames from 'classnames';
import { IconChevronDown } from '@tabler/icons';
import MyLink from './DropdownLink';

export default function AppDropdown({ links }) {
  return (
    <Menu as="div" className="relative inline-block text-left z-[50]">
      <Menu.Button className="relative inline-flex items-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 transition bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 hover:opacity-90 rounded-xl">
        <div>Menu</div>
        <IconChevronDown className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5  z-[50]">
          {links.map(
            link =>
              link.url && (
                <Menu.Item key={link?.url}>
                  {({ active }) => (
                    <MyLink
                      href={link.url}
                      className={classnames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm hover:bg-gray-100 '
                      )}
                    >
                      {link.name}
                    </MyLink>
                  )}
                </Menu.Item>
              )
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
