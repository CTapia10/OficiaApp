using System;

namespace OficiaApp.Domain.Common;

public abstract class BaseEntity
{
    public Guid ID { get; protected set; }
    public DateTime FechaCreacion { get; protected set; }

    protected BaseEntity()
	{
		ID = Guid.NewGuid();
		FechaCreacion = DateTime.UtcNow;
    }

}
