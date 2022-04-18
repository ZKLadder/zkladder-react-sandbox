interface Contract {
  address:string,
  chainId:string,
  templateId:string,
  creator:string,
  admins:string[],
  projectId?:string
}

interface ContractWithMetadata extends Contract{
  name:string,
  symbol:string,
  description?:string,
  image?:string,
  totalSupply:number,
  whitelisted?:32
}

interface ContractMetrics {
  totalProjects:number,
  totalMinted:number,
  totalRevenue:string,
  totalTrades: number

}

export type { Contract, ContractWithMetadata, ContractMetrics };
