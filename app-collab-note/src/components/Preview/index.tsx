import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'redux/types';
import { render } from 'utils/MDUtils/mdToHtml';
import { Resource } from 'utils/types';
import './Preview.css';

interface Props {
  markdown: string;
  resources: Resource[];
}

function Preview({ markdown, resources }: Props) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    setHtml(render(markdown, resources));
  }, [markdown, resources]);

  return (
    <div dangerouslySetInnerHTML={{
      __html: html
    }}></div>
  );
}

const mapStateToProps = (state: { app: AppState }) => {
  const { note, resources } = state.app;
  return {
    markdown: note?.body || '',
    resources: resources,
  };
};

export default connect(mapStateToProps)(Preview);
