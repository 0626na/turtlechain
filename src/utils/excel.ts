import * as Excel from 'exceljs';
import saveAs from 'file-saver';

interface Data {
  fileName: string;
  headerNames: string[];
  contents: (string | number)[][];
}

export const convertToExcel = async (data: Data) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('My Sheet');

  // 헤더 설정
  worksheet.columns = data.headerNames.map((name) => ({
    header: name,
    width: 30,
    style: columnsStyle,
  }));

  // content 설정
  data.contents.forEach((v) => {
    worksheet.addRow([...v]);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), data.fileName);
};

const columnsStyle = { alignment: { horizontal: 'left' } } as const;
