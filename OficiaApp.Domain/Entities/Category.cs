using System;

using OficiaApp.Domain.Common;

namespace OficiaApp.Domain.Entities
{

    public class Category : BaseEntity
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        private readonly List<ProfessionalProfile> _professionalProfiles = new List<ProfessionalProfile>();
        public IReadOnlyCollection<ProfessionalProfile> ProfessionalProfiles => _professionalProfiles.AsReadOnly();

        public Category(string name, string description)
        {
            Name = name;
            Description = description;
        }

    }

    
}
