
import React, { useState } from "react";
import { Modal, Table } from "antd";

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log("Selected:", selectedRowKeys, selectedRows);
  },
};

function Tables({ datas }) {
  const [opendata, setOpen] = useState({ status: false, data: null });

  return (
    <>
      <Table
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={datas.columns}
        dataSource={datas.value}
        scroll={{ x: true }}
        pagination={false}
        onRow={(record) => ({
          onClick: () =>
            setOpen({ status: true, data: record }),
        })}
      />
      {opendata.status && (
        <Modal
          title="Thông tin tài khoản"
          open={opendata.status}
          onCancel={() => setOpen({ status: false, data: null })}
          okButtonProps={{ disabled: true }}
        >
          <p><strong>ID:</strong> {opendata.data.id}</p>
          <p><strong>Email:</strong> {opendata.data.email}</p>
          <p><strong>Phone:</strong> {opendata.data.phone || "Không có"}</p>
          <p><strong>Role:</strong> {opendata.data.role}</p>
          <p><strong>Kích hoạt:</strong> {opendata.data.is_activated ? "✅" : "❌"}</p>
        </Modal>
      )}
    </>
  );
}

export default Tables;