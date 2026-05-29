import { prisma } from "@/lib/prisma";
import { Device } from "@prisma/client";

export default async function DevicePage() {
  const devices =
    await prisma.device.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Device
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
{devices.map((device: Device) => (
          <div
            key={device.id}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {device.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {device.type}
                </p>
              </div>

              <div>
                {device.isAvailable ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                    Tersedia
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">
                    Dipakai
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}