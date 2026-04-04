import { BarChart } from "@mui/x-charts/BarChart";
import { TopProduct } from "../report.type";

type ProductBarChartProps = {
  data: TopProduct[];
};

const PRODUCT_COLORS = ["#f5a623", "#4caf50", "#2196f3", "#9c27b0", "#ff5722"];

export function ProductBarChart({ data }: ProductBarChartProps) {
  const chartHeight = Math.max(300, data.length * 80);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 8,
        }}
      >
        {data.map((item, index) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 16,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: PRODUCT_COLORS[index % PRODUCT_COLORS.length],
              }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <BarChart
        height={chartHeight}
        layout="horizontal"
        dataset={
          data.map((item) => ({
            name: item.name,
            value: item.value,
          })) || []
        }
        yAxis={[
          {
            scaleType: "band",
            dataKey: "name",
            colorMap: {
              type: "ordinal",
              values: data.map((item) => item.name),
              colors: PRODUCT_COLORS,
            },
            tickLabelStyle: {
              fontSize: 14,
              fontWeight: 600,
              fill: "#444",
            },
          },
        ]}
        series={[
          {
            dataKey: "value",
            barLabel: (item) => `${item.value?.toLocaleString()}`,
          },
        ]}
        sx={{
          // ขยายตัวอักษรแกน Y: มือถือใหญ่ขึ้น, desktop ปรับลงได้
          "& .MuiChartsAxis-tickLabel": {
            fontSize: { xs: 16, md: 14 }, // xs = mobile, md ขึ้นไปเล็กลงนิด
          },
          "& .MuiBarLabel-root": {
            fontSize: "16px",
            fontWeight: "bold",
            fill: "black",
            transform: "translateX(8px)",
          },
        }}
      />
    </>
  );
}
