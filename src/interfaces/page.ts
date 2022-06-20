/* eslint-disable no-undef */

interface LoadingStateInterface {
  loading:boolean,
  header?:string,
  content?:string | JSX.Element
}

interface ErrorStateInterface {
  showError: boolean,
  content?: string
}

export type { LoadingStateInterface, ErrorStateInterface };
