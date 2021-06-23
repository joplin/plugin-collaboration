import React from 'react';
import { connect } from 'react-redux';
import { render } from 'utils/MDUtils/mdToHtml';
import './Preview.css';

interface Props {
  markdown: string;
}

function Preview({ markdown }: Props) {
  return (
    <div dangerouslySetInnerHTML={{
      __html: render(markdown)
    }}></div>
  );
}

const mapStateToProps = (state: any) => {
  const { note } = state.app;
  return {
    markdown: note?.body || '',
  };
};

export default connect(mapStateToProps)(Preview);
