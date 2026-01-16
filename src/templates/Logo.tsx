import { AppConfig } from '@/utils/AppConfig';

export const Logo = (props: {
  isTextHidden?: boolean;
}) => (
  <div className="flex items-center text-xl font-semibold">
    <svg
      className="mr-2 size-8"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Crypto/Learning icon - stylized T with blockchain elements */}
      <circle cx="16" cy="16" r="14" className="stroke-primary" strokeWidth="2" />
      <path
        d="M10 12h12M16 12v10"
        className="stroke-primary"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="22" r="2" className="fill-primary" />
      <circle cx="10" cy="12" r="1.5" className="fill-primary" />
      <circle cx="22" cy="12" r="1.5" className="fill-primary" />
    </svg>
    {!props.isTextHidden && (
      <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
        {AppConfig.name}
      </span>
    )}
  </div>
);
