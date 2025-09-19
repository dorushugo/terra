import type { CollectionAfterChangeHook } from 'payload'

export const updateCustomerStats: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  // Mise à jour des statistiques client après création/modification d'une commande
  if (operation === 'create' || operation === 'update') {
    const customerEmail = doc.customer?.email

    if (customerEmail) {
      try {
        // Trouver ou créer le client
        const customers = await req.payload.find({
          collection: 'customers',
          where: {
            email: {
              equals: customerEmail,
            },
          },
          limit: 1,
        })

        let customerId: string

        if (customers.docs.length === 0) {
          // Créer un nouveau client
          const newCustomer = await req.payload.create({
            collection: 'customers',
            data: {
              email: customerEmail,
              firstName: doc.customer.firstName,
              lastName: doc.customer.lastName,
              phone: doc.customer.phone || '',
              stats: {
                totalOrders: 0,
                totalSpent: 0,
                averageOrderValue: 0,
              },
            },
          })
          customerId = newCustomer.id
        } else {
          customerId = customers.docs[0].id
        }

        // Calculer les nouvelles statistiques
        const allOrders = await req.payload.find({
          collection: 'orders',
          where: {
            'customer.email': {
              equals: customerEmail,
            },
            status: {
              not_equals: 'cancelled',
            },
          },
        })

        const totalOrders = allOrders.docs.length
        const totalSpent = allOrders.docs.reduce((sum, order) => {
          return sum + (order.pricing?.total || 0)
        }, 0)
        const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

        // Trouver la date de dernière commande
        const lastOrder = allOrders.docs.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0]
        const lastOrderDate = lastOrder ? lastOrder.createdAt : null

        // Mettre à jour le client
        await req.payload.update({
          collection: 'customers',
          id: customerId,
          data: {
            firstName: doc.customer.firstName,
            lastName: doc.customer.lastName,
            phone: doc.customer.phone || '',
            stats: {
              totalOrders,
              totalSpent,
              averageOrderValue,
              lastOrderDate,
            },
          },
        })

        req.payload.logger.info(`Customer stats updated for ${customerEmail}`)
      } catch (error) {
        req.payload.logger.error(`Error updating customer stats: ${error}`)
      }
    }
  }
}
