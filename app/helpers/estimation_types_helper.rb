module EstimationTypesHelper
    def options_for_estimation_types(estimation_types)
        estimation_types.sort_by(&:id).collect { |o| [o.name, o.id ]}
    end
end  