const escapeValue = (value) => {
  const stringValue = value == null ? '' : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
};

const toCsv = (rows) => {
  if (!rows.length) {
    return 'title,amount,type,category,date,paymentMethod,notes\n';
  }

  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeValue(row[header])).join(',')),
  ];

  return `${csvRows.join('\n')}\n`;
};

module.exports = { toCsv };
