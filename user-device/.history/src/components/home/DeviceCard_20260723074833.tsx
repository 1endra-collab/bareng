import Link from "next/link";

interface Props {
  href: string;
  icon: string;
  title: string;
  description: string;
}

export default function DeviceCard({
  href,
  icon,
  title,
  description,
}: Props) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-xl transition"
    >
      <div className="text-7xl text-center">
        {icon}
      </div>

      <h2 className="text-3xl font-semibold text-center mt-6">
        {title}
      </h2>

      <p className="text-center mt-3 text-gray-500">
        {description}
      </p>
    </Link>
  );
}