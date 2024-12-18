"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import logowhite from "@/public/assets/landing-page/logowhite.svg";
import Image from "next/image";
import { useAuth } from "@/context/authentication";

export function Sidebar() {
  const pathname = usePathname();
  const { logoutAdmin } = useAuth();

  const links = [
    {
      path: "/admin/dashboard",
      label: "Pet Owner",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="20"
          fill="currentColor"
          viewBox="0 3 22 20"
        >
          <path
            d="M15.7085 13.2101C16.6889 12.4388 17.4045 11.381 17.7558 10.1841C18.107 8.98709 18.0765 7.71039 17.6683 6.53159C17.2602 5.35279 16.4948 4.33052 15.4786 3.60698C14.4624 2.88344 13.246 2.49463 11.9985 2.49463C10.7511 2.49463 9.53465 2.88344 8.51846 3.60698C7.50228 4.33052 6.73688 5.35279 6.32874 6.53159C5.92061 7.71039 5.89004 8.98709 6.24129 10.1841C6.59254 11.381 7.30814 12.4388 8.28853 13.2101C6.60861 13.8832 5.14282 14.9995 4.04742 16.44C2.95203 17.8806 2.26809 19.5914 2.06853 21.3901C2.05409 21.5214 2.06565 21.6543 2.10256 21.7812C2.13947 21.908 2.201 22.0264 2.28364 22.1294C2.45055 22.3376 2.69332 22.471 2.95853 22.5001C3.22375 22.5293 3.48969 22.4519 3.69786 22.285C3.90602 22.1181 4.03936 21.8753 4.06853 21.6101C4.28812 19.6553 5.22022 17.8499 6.68675 16.5389C8.15328 15.2279 10.0514 14.5032 12.0185 14.5032C13.9856 14.5032 15.8838 15.2279 17.3503 16.5389C18.8168 17.8499 19.7489 19.6553 19.9685 21.6101C19.9957 21.8558 20.113 22.0828 20.2976 22.2471C20.4823 22.4115 20.7213 22.5016 20.9685 22.5001H21.0785C21.3407 22.47 21.5803 22.3374 21.7451 22.1314C21.9099 21.9253 21.9866 21.6625 21.9585 21.4001C21.758 19.5963 21.0704 17.8811 19.9694 16.4383C18.8684 14.9955 17.3954 13.8796 15.7085 13.2101ZM11.9985 12.5001C11.2074 12.5001 10.434 12.2655 9.77625 11.826C9.11845 11.3865 8.60576 10.7618 8.30301 10.0309C8.00026 9.29995 7.92105 8.49569 8.07539 7.71976C8.22973 6.94384 8.61069 6.23111 9.1701 5.6717C9.72951 5.11229 10.4422 4.73132 11.2182 4.57698C11.9941 4.42264 12.7984 4.50186 13.5293 4.80461C14.2602 5.10736 14.8849 5.62005 15.3244 6.27784C15.7639 6.93564 15.9985 7.709 15.9985 8.50012C15.9985 9.56099 15.5771 10.5784 14.827 11.3286C14.0768 12.0787 13.0594 12.5001 11.9985 12.5001Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      path: "/admin/petsitter",
      label: "Pet Sitter",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="20"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M14.2481 10.878C13.3157 9.38905 11.7276 8.5 9.99998 8.5C8.27249 8.5 6.68429 9.38905 5.75201 10.878L3.50519 14.4657C3.1324 15.0611 2.9604 15.7486 3.00767 16.454C3.05494 17.1596 3.31721 17.8166 3.76604 18.3543C4.21518 18.8919 4.80867 19.2592 5.4823 19.4168C6.15594 19.5743 6.84649 19.5071 7.47918 19.2225L7.52044 19.2037C9.1126 18.5012 10.9324 18.5075 12.5206 19.2225C12.9302 19.4068 13.3642 19.5 13.8021 19.5C14.0402 19.5 14.2797 19.4723 14.517 19.417C15.1907 19.2595 15.7841 18.8922 16.2334 18.3546C16.6824 17.8171 16.9449 17.1599 16.9923 16.4544C17.0397 15.7486 16.8677 15.0611 16.4949 14.4656L14.2481 10.878ZM15.3103 17.5465C14.7388 18.2303 13.8143 18.4465 13.0096 18.0844C12.0531 17.6538 11.0265 17.4386 9.9995 17.4386C8.97348 17.4386 7.94698 17.6536 6.99114 18.0837L6.96395 18.096C6.16542 18.4417 5.25449 18.2227 4.6893 17.5465C4.11843 16.8625 4.05345 15.8941 4.52773 15.1366L6.77471 11.5489C7.48266 10.4184 8.68828 9.74344 9.99998 9.74344C11.3117 9.74344 12.5175 10.4184 13.2256 11.5489L15.4722 15.1365C15.9467 15.8943 15.8815 16.8628 15.3103 17.5465Z" />
          <path d="M3.49763 11.3405C4.12624 11.0765 4.60379 10.5227 4.84241 9.7809C5.06929 9.07506 5.05071 8.27818 4.78978 7.53689C4.52871 6.7961 4.05383 6.19137 3.45273 5.83389C2.82101 5.45853 2.12713 5.39741 1.49957 5.6619C0.237006 6.19267 -0.342386 7.89859 0.208163 9.46553C0.647949 10.7127 1.67367 11.5 2.71069 11.5C2.97548 11.5 3.24102 11.4486 3.49763 11.3405ZM1.27417 9.01686C0.949762 8.09351 1.23478 7.11131 1.90992 6.82747C2.03183 6.7761 2.16073 6.75058 2.29231 6.75058C2.4954 6.75058 2.70519 6.81122 2.90709 6.93135C3.27016 7.14707 3.56023 7.52161 3.72377 7.98573C3.88717 8.45017 3.90174 8.94046 3.76466 9.36653C3.63902 9.75701 3.39861 10.0441 3.08788 10.1746C2.41363 10.4588 1.59963 9.9394 1.27417 9.01686Z" />
          <path d="M7.99984 7.5C9.65411 7.5 11 5.93009 11 4.0004C11 2.07023 9.65411 0.5 7.99984 0.5C6.34573 0.5 5 2.07023 5 4.0004C5 5.93009 6.34573 7.5 7.99984 7.5ZM7.99984 1.72578C8.99387 1.72578 9.80277 2.74622 9.80277 4.0004C9.80277 5.2541 8.99387 6.27422 7.99984 6.27422C7.00582 6.27422 6.19723 5.2541 6.19723 4.0004C6.19723 2.74622 7.00582 1.72578 7.99984 1.72578Z" />
          <path d="M13.9387 8.37912C14.2117 8.46092 14.4904 8.5 14.7677 8.5C16.062 8.5 17.3233 7.64965 17.8046 6.34281C18.0818 5.59054 18.0635 4.79512 17.7533 4.10322C17.4286 3.37902 16.827 2.85327 16.059 2.62268C15.291 2.3924 14.46 2.48838 13.7196 2.89311C13.0123 3.27988 12.4703 3.90704 12.1936 4.65931C11.6094 6.24623 12.3922 7.91494 13.9387 8.37912ZM13.4125 5.02495C13.5932 4.53375 13.9386 4.12902 14.3851 3.88486C14.7982 3.65895 15.2489 3.60146 15.6539 3.72294C16.0588 3.84457 16.3815 4.134 16.5627 4.53813C16.7584 4.97485 16.7668 5.48581 16.5857 5.97701C16.2248 6.95729 15.2191 7.5413 14.344 7.27887C13.4695 7.0163 13.0515 6.00523 13.4125 5.02495Z" />
          <path d="M20.1082 8.98679C19.0511 8.08343 17.4697 8.47448 16.5833 9.85959C15.6978 11.2454 15.8362 13.1084 16.8917 14.0124C17.2767 14.3423 17.7315 14.5 18.197 14.5C19.0084 14.5 19.8525 14.0209 20.4166 13.1399C21.3022 11.7542 21.1639 9.89116 20.1082 8.98679ZM19.525 12.3764C19.0016 13.1937 18.1166 13.4648 17.5519 12.9809C16.9876 12.4977 16.9532 11.4396 17.4752 10.6228C17.8222 10.0806 18.329 9.77891 18.7961 9.77891C19.0324 9.77891 19.2585 9.85608 19.4485 10.0186C20.0123 10.5024 20.0466 11.5601 19.525 12.3764Z" />
        </svg>
      ),
    },
    {
      path: "/admin/report",
      label: "Report",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="20"
          fill="currentColor"
          viewBox="0 3 20 20"
        >
          <path
            d="M21 8.94C20.9896 8.84813 20.9695 8.75763 20.94 8.67V8.58C20.8919 8.47718 20.8278 8.38267 20.75 8.3L14.75 2.3C14.6673 2.22222 14.5728 2.15808 14.47 2.11C14.4402 2.10576 14.4099 2.10576 14.38 2.11C14.2784 2.05174 14.1662 2.01434 14.05 2H10C9.20435 2 8.44129 2.31607 7.87868 2.87868C7.31607 3.44129 7 4.20435 7 5V6H6C5.20435 6 4.44129 6.31607 3.87868 6.87868C3.31607 7.44129 3 8.20435 3 9V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H14C14.7956 22 15.5587 21.6839 16.1213 21.1213C16.6839 20.5587 17 19.7956 17 19V18H18C18.7956 18 19.5587 17.6839 20.1213 17.1213C20.6839 16.5587 21 15.7956 21 15V9V8.94ZM15 5.41L17.59 8H16C15.7348 8 15.4804 7.89464 15.2929 7.70711C15.1054 7.51957 15 7.26522 15 7V5.41ZM15 19C15 19.2652 14.8946 19.5196 14.7071 19.7071C14.5196 19.8946 14.2652 20 14 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V9C5 8.73478 5.10536 8.48043 5.29289 8.29289C5.48043 8.10536 5.73478 8 6 8H7V15C7 15.7956 7.31607 16.5587 7.87868 17.1213C8.44129 17.6839 9.20435 18 10 18H15V19ZM19 15C19 15.2652 18.8946 15.5196 18.7071 15.7071C18.5196 15.8946 18.2652 16 18 16H10C9.73478 16 9.48043 15.8946 9.29289 15.7071C9.10536 15.5196 9 15.2652 9 15V5C9 4.73478 9.10536 4.48043 9.29289 4.29289C9.48043 4.10536 9.73478 4 10 4H13V7C13 7.79565 13.3161 8.55871 13.8787 9.12132C14.4413 9.68393 15.2044 10 16 10H19V15Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <aside className="w-[240px] bg-black text-white flex flex-col">
        <div className="pl-4 mt-4 h-36 flex flex-col justify-center">
          {/* Logo */}
          <Link href={`/`}>
            <button className="w-20 md:w-32">
              <Image src={logowhite} alt="Logo" />
            </button>
          </Link>
          <p className="font-medium italic text-sm leading-none text-gray-400">
            Admin Panel
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm font-medium">
          <div className="flex flex-col justify-center space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`h-14 px-4 flex items-center space-x-2 text-base font-medium leading-6 hover:bg-gray-800 ${
                  pathname === link.path
                    ? "bg-gray-800 text-white"
                    : "text-gray-300"
                }`}
              >
                <span
                  className={`w-5 h-5 transition-colors duration-200 ${
                    pathname === link.path ? "text-white" : "text-gray-300"
                  }`}
                >
                  {link.icon}
                </span>

                <span
                  className={`${
                    pathname === link.path ? "text-white" : "text-gray-300"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>
        <div className="mt-auto pb-2">
          <hr className="border-gray-500"></hr>
          <button
            onClick={() => logoutAdmin()}
            className="w-full h-14 px-4 flex items-center gap-1 text-base font-medium leading-6 hover:bg-gray-800 text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H12.59L10.29 15.29C10.1963 15.383 10.1219 15.4936 10.0711 15.6154C10.0203 15.7373 9.9942 15.868 9.9942 16C9.9942 16.132 10.0203 16.2627 10.0711 16.3846C10.1219 16.5064 10.1963 16.617 10.29 16.71C10.383 16.8037 10.4936 16.8781 10.6154 16.9289C10.7373 16.9797 10.868 17.0058 11 17.0058C11.132 17.0058 11.2627 16.9797 11.3846 16.9289C11.5064 16.8781 11.617 16.8037 11.71 16.71L15.71 12.71C15.801 12.6149 15.8724 12.5028 15.92 12.38C16.02 12.1365 16.02 11.8635 15.92 11.62C15.8724 11.4972 15.801 11.3851 15.71 11.29L11.71 7.29C11.6168 7.19676 11.5061 7.1228 11.3842 7.07234C11.2624 7.02188 11.1319 6.99591 11 6.99591C10.8681 6.99591 10.7376 7.02188 10.6158 7.07234C10.4939 7.1228 10.3832 7.19676 10.29 7.29C10.1968 7.38324 10.1228 7.49393 10.0723 7.61575C10.0219 7.73757 9.99591 7.86814 9.99591 8C9.99591 8.13186 10.0219 8.26243 10.0723 8.38425C10.1228 8.50607 10.1968 8.61676 10.29 8.71L12.59 11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12ZM17 2H7C6.20435 2 5.44129 2.31607 4.87868 2.87868C4.31607 3.44129 4 4.20435 4 5V8C4 8.26522 4.10536 8.51957 4.29289 8.70711C4.48043 8.89464 4.73478 9 5 9C5.26522 9 5.51957 8.89464 5.70711 8.70711C5.89464 8.51957 6 8.26522 6 8V5C6 4.73478 6.10536 4.48043 6.29289 4.29289C6.48043 4.10536 6.73478 4 7 4H17C17.2652 4 17.5196 4.10536 17.7071 4.29289C17.8946 4.48043 18 4.73478 18 5V19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H7C6.73478 20 6.48043 19.8946 6.29289 19.7071C6.10536 19.5196 6 19.2652 6 19V16C6 15.7348 5.89464 15.4804 5.70711 15.2929C5.51957 15.1054 5.26522 15 5 15C4.73478 15 4.48043 15.1054 4.29289 15.2929C4.10536 15.4804 4 15.7348 4 16V19C4 19.7956 4.31607 20.5587 4.87868 21.1213C5.44129 21.6839 6.20435 22 7 22H17C17.7956 22 18.5587 21.6839 19.1213 21.1213C19.6839 20.5587 20 19.7956 20 19V5C20 4.20435 19.6839 3.44129 19.1213 2.87868C18.5587 2.31607 17.7956 2 17 2Z"
                fill="#AEB1C3"
              />
            </svg>
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
