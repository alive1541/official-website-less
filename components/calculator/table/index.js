import "./index.less";
import { Icon } from "antd";

export function Table({ data, columns }) {
  return (
    <table className="d-table-wrap">
      <thead>
        <tr>
          {columns.map(item => {
            const title = item.title;
            return <th title={title}>{title}</th>;
          })}
        </tr>
      </thead>

      <tbody>
        {data.map(item => {
          return (
            <tr key={item.key}>
              {columns.map((col, index) => {
                let con = item[col.key] || "";
                if (typeof col.render === "function") {
                  con = col.render(con, item);
                  return <td key={index}>{con}</td>;
                }
                return (
                  <td key={index} title={con}>
                    {con}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function NoHeaderTable({ data, columns }) {
  if (columns.length === 3) {
    columns.splice(2, 0, {});
  }
  return (
    <table className="d-table-wrap">
      {data.map(item => {
        return (
          <tbody key={item.key}>
            <tr>
              {columns.map((col, index) => {
                let con = item[col.key] || "";
                if (index === 2) {
                  return <td key={index} />;
                }
                if (typeof col.render === "function") {
                  con = col.render(con, item);
                  return <td key={index}>{con}</td>;
                }
                return (
                  <td key={index} title={con}>
                    {con}
                  </td>
                );
              })}
            </tr>
          </tbody>
        );
      })}
    </table>
  );
}
