import React, { useEffect } from 'react';
import * as powerbi from 'powerbi-client';

const PowerBIReport = () => {
  useEffect(() => {
    const embedConfig = {
      type: 'report',
      id: 'reportId', // Replace with your report ID
      embedUrl: 'reportEmbedUrl', // Replace with your report embed URL
      accessToken: 'accessToken', // Replace with your access token
      // Additional configuration options
    };

    const reportContainer = document.getElementById('reportContainer');
    const report = powerbi.embed(reportContainer, embedConfig);

    // Example: Pass data to the report
    const data = {
      category: 'Category',
      value: 100,
    };
    report.setFilters([{
      $schema: 'http://powerbi.com/product/schema#basic',
      target: {
        table: 'TableName',
        column: 'ColumnName'
      },
      operator: 'In',
      values: [data.category]
    }]);

    return () => {
      // Clean up
      report.destroy();
    };
  }, []);

  return <div id="reportContainer" />;
};

export default PowerBIReport;
