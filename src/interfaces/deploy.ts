interface MemberNftConfig {
  name:string,
  symbol:string,
  description:string,
  image:any,
  beneficiaryAddress: string,
  script:any
}

interface MemberNftRole {
  id:string,
  name:string,
  description:string,
  price:number
}

interface NewDeploymentStateInterface {
  currentStep:number,
  selectedTemplate?:string
  config:MemberNftConfig
  roles: MemberNftRole[]
}

export type { NewDeploymentStateInterface };
