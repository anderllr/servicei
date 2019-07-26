import { authenticated } from "./auth.resolver";

export default {
	Query: {
		clientes: authenticated(async (parent, args, { db: { Cliente } }) => {
			const clientes = await Cliente.find(args).sort("name");
			return clientes.map(cliente => {
				return cliente;
			});
		}),
		clienteById: authenticated(async (parent, args, { db: { Cliente } }) => {
			const cliente = await Cliente.findById(args.id);
			return cliente;
		}),
		clientesByName: authenticated(
			async (parent, { name }, { db: { Cliente } }) => {
				const clientes = await Cliente.find({ name: new RegExp(name, "i") });
				return clientes.map(cliente => {
					cliente._id = cliente._id.toString();
					return cliente;
				});
			}
		)
	},
	Mutation: {
		createCliente: authenticated(
			async (parent, { input }, { db: { Cliente } }) => {
				const cliente = await new Cliente(input).save();
				return cliente;
			}
		),
		updateCliente: authenticated(
			async (parent, { id, input }, { db: { Cliente } }) => {
				const cliente = await Cliente.findById(id);
				cliente.set(input);
				await cliente.save();
				if (!cliente) {
					return false;
				}
				return cliente;
			}
		),
		deleteCliente: authenticated(
			async (parent, { id }, { db: { Cliente } }) => {
				const clienteRemoved = await Cliente.findByIdAndRemove(id);

				if (!clienteRemoved) {
					throw new Error("Error removing cliente");
				}

				return clienteRemoved;
			}
		)
	}
};
